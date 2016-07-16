Meteor.methods({

	cerrarAsunto: function (asuntoId) {
			console.log(asuntoId)
			check(asuntoId,String);
			if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) Asuntos.update({_id: asuntoId}, {$set: {abierto: false}});

	},

	crearAsunto: function (asuntos) {

		// let dataCheck = {
		// 	cliente: Object,
		// 	caratula: String,
		// 	carpeta: String,
		// 	// abogados: [Object],
		// 	area: String,
		// 	juzgado: String,
		// 	observaciones: String,
		// 	inicio: String,
		// 	responsable: Object,
		// 	bufeteId: String,
		// 	equipoId: String
		//
		// }

		check(asuntos,Object)
		// if(asuntos.facturacion) dataCheck.facturacion = Object

		// check(asuntos, dataCheck);

		if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) {
			asuntos.createdAt = new Date();

			let cliente = Clientes.findOne({_id: asuntos.cliente.id})
			console.log(cliente);
			console.log(asuntos.equipoId);
			asuntos.abogados = [];
			if(asuntos.equipoId) asuntos.abogados = Equipos.findOne({_id:asuntos.equipoId}).miembros;
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

			let asuntoId = Asuntos.insert(asuntos);


			if (asuntoId) {

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
