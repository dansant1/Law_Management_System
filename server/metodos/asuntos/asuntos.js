function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

Meteor.methods({

	cerrarAsunto: function (asuntoId) {
			console.log(asuntoId)
			check(asuntoId,String);
			if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) Asuntos.update({_id: asuntoId}, {$set: {abierto: false}});

	},

	crearAsunto: function (asuntos) {

		check(asuntos,Object)
		// if(asuntos.facturacion) dataCheck.facturacion = Object

		// check(asuntos, dataCheck);

		if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) {
			asuntos.createdAt = new Date();
			console.log(asuntos.workflow);
			let cliente = Clientes.findOne({_id: asuntos.cliente.id})
			// console.log(cliente);
			// console.log(asuntos.equipoId);
			asuntos.equipo={}
			asuntos.abogados = [];
			if(asuntos.equipoId){
				asuntos.abogados = Equipos.findOne({_id:asuntos.equipoId}).miembros;
				asuntos.equipo.id = asuntos.equipoId;
				asuntos.equipo.nombre = Equipos.findOne({_id:asuntos.equipoId}).nombre;
			}
			else {
				Meteor.users.find({'profile.bufeteId':asuntos.bufeteId},
						{'profile.nombre':1,'profile.apellido':1}).forEach(function (cliente) {
							asuntos.abogados.push(
								{
									id: cliente._id,
									nombre: cliente.profile.nombre + " " + cliente.profile.apellido
								}
						);
				});
			}
			if(!asuntos.facturacion){
				if(cliente.facturacion) asuntos.facturacion = cliente.facturacion
				else return{
					error:'No existen facturacion para asignar intentelo nuevamente'
				}
			}

			Clientes.update({_id:asuntos.cliente.id},{$set:{estatus:'cliente'}});


			if (asuntos.inicio !== "") {
				asuntos.inicio	= new Date(/*asuntos.inicio + " GMT-0500"*/);
			} else {
				asuntos.inicio = "";
			}

			let fecha = asuntos.inicio;

			if (asuntos.carpeta === "" || asuntos.carpeta === undefined) {
				asuntos.carpeta = "0"
			}

			asuntos.creadorId = this.userId;
			asuntos.abierto = true;
			var _workflow = asuntos.workflow

			let asuntoId = Asuntos.insert(asuntos);

			if (asuntoId) {

				if(_workflow) {
					Meteor.defer(function() {
  					let workflow = Workflows.findOne(_workflow.id)
					//console.log(workflow);
					workflow.etapas.forEach(function (etapa) {
						etapa.asunto={
							id:asuntoId,
							nombre:asuntos.caratula
						}
						etapa.bufeteId =  Meteor.users.findOne(Meteor.userId()).profile.bufeteId;

						var _tareas = etapa.tareas;
						var etapaNombre = etapa.nombre;

						var etapaId = Etapas.insert(etapa);
						_tareas.forEach(function (tarea) {
							tarea.asunto={
								id:asuntoId,
								nombre:asuntos.caratula
							}

							tarea.etapa = {
								id: etapaId,
								nombre: etapaNombre
							}

							tarea.bufeteId = Meteor.users.findOne(Meteor.userId()).profile.bufeteId;

							var date = new Date();
							date.setDate(date.getDate()+ tarea.duracion);
							if(date.getDay()==0) date.setDate(date.getDate()+ 1);
							else if(date.getDay()==6) date.setDate(date.getDate()+2);

							let usuario = Meteor.users.findOne(Meteor.userId());

							tarea.vence = date;
							tarea.creador = {
								id:Meteor.userId(),
								nombre: usuario.profile.nombre +  "  " + usuario.profile.apellido
							}
							tarea.abierto = true;

							let tareaId = Tareas.insert(tarea);

							let evento = {
								title: tarea.descripcion,
								start: formatDate(tarea.vence),
								asunto: tarea.asunto,
								bufeteId: tarea.bufeteId,
								creador: tarea.creador,
								createdAt: new Date(),
								color: '#34495e',
								tarea: {
									nombre: tarea.descripcion,
									id: tareaId
								}
							}

							Eventos.insert(evento);
							MiCalendario.insert(evento);
						})

					})
				});
				
				}
				
				


				// Creamos el evento de inicio de expediente (asunto)
				let evento = {
					title: "Inicio de expediente " + asuntos.caratula + " - Asignado a " + asuntos.responsable.nombre,
					start: fecha,
					end: fecha,
					asunto: {
						nombre: asuntos.caratula,
						id: asuntoId
					},
					bufeteId: asuntos.bufeteId,
					creador: asuntos.responsable,
					createdAt: new Date(),
					color: '#F1C40F'
				};

				if (fecha !== "") {
					Eventos.insert(evento);
				}

				NewsFeed.insert({
					descripcion: 'creó el asunto ' + asuntos.caratula + ' [' + asuntos.carpeta + ']',
					tipo: 'Expediente',
					creador: {
						nombre: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido ,
						id: this.userId
					},
					asunto: {
						nombre: asuntos.caratula,
						id: asuntoId
					},
					bufeteId: asuntos.bufeteId,
					createdAt: new Date()
				});

				return {
					asuntoId: asuntoId
				};
			}

		} else {
			return;
		}
	},
	editarAsunto:function (datos,asuntoId) {
		check(datos,Object);
		check(asuntoId,String)

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
			console.log(asuntoId);
			console.log(datos);
			datos.abogados = []
			datos.equipo = {}
			if(datos.equipoId){
				datos.abogados = Equipos.findOne({_id:datos.equipoId}).miembros;
				datos.equipo.id = datos.equipoId;
				datos.equipo.nombre = Equipos.findOne({_id:datos.equipoId}).nombre;
			}
			else {
				Meteor.users.find({'profile.bufeteId':datos.bufeteId},
						{'profile.nombre':1,'profile.apellido':1}).forEach(function (cliente) {
							datos.abogados.push(
								{
									id: cliente._id,
									nombre: cliente.profile.nombre + " " + cliente.profile.apellido
								}
						);
				});
			}

			// if(datos.facturacion.forma_cobro=="")

			Asuntos.update({_id:asuntoId},{
				$set:datos
			})

		} else {
			return;
		}


	},
	'agregarEtapaAsunto':function (datos) {
		check(datos,Object)

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			Etapas.insert(datos);

		} else {
			return;
		}

	},
	'crearEstado': function (datos) {
		check(datos, {
			nombre: String,
			descripcion: String,
			bufeteId: String,
			creadorId: String,
			asuntoId: String,
			fecha: String
		});

		if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) {
			datos.createdAt = new Date();
			let fecha = datos.fecha;
			datos.fecha = new Date(datos.fecha);
			let creador = Meteor.users.findOne({_id: datos.creadorId}).profile;
      datos.autor = creador.nombre + ' ' + creador.apellido;
			let estadoId = Estados.insert(datos);

			if (estadoId) {
				let asunto = Asuntos.findOne({_id: datos.asuntoId});


				// Creamos el evento de inicio de estado  (asunto)
				let evento = {
					title: "Inicio de nuevo estado " + datos.nombre + " - En el asunto " + asunto.caratula + " por " + creador.nombre + " " + creador.apellido,
					start: fecha,
					end: fecha,
					asunto: {
						nombre: asunto.caratula,
						id: datos.asuntoId
					},
					bufeteId: datos.bufeteId,
					creador: {
						nombre: creador.nombre + " " + creador.apellido,
						id: datos.creadorId
					},
					createdAt: new Date(),
					color: '#9b59b6'
				};

				Eventos.insert(evento);

				NewsFeed.insert({
					descripcion: 'agregó el estado ' + datos.nombre + ' en el asunto ' + asunto.caratula,
					tipo: 'Estado',
					creador: {
						nombre: creador.nombre + ' ' + creador.apellido,
						id: datos.creadorId
					},
					asunto: {
						nombre: asunto.caratula,
						id: datos.asuntoId
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});
			}

		} else {
			return;
		}
	}
});
