Meteor.methods({
	crearTarea: function (datos) {

		let _check = {
			asunto: Object,
			bufeteId: String,
			creador: Object
		}
		if(datos.tipo) 	_check.tipo = String;
		if(datos.fecha)  _check.fecha = String;
		if(datos.descripcion) _check.descripcion = String;
		if(datos.asignado) _check.asignado = Object;
		if(datos.etapa) _check.etapa = Object;
		check(datos, _check);

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.vence	= new Date(datos.fecha+" GMT-0500");
			datos.abierto = true;
			console.log(datos);

			let tarea = Tareas.insert(datos);

			// Modulo para crear evento sobre que se ha creado una tarea
			if (tarea) {

				let evento = {
					title: "Vencimiento de tarea: " + datos.descripcion + " - Asunto: " + datos.asunto.nombre + " - Asignado a " + datos.creador.nombre,
					start: datos.fecha,
					end: datos.fecha,
					asunto: datos.asunto,
					bufeteId: datos.bufeteId,
					creador: datos.creador,
					createdAt: datos.createdAt,
					color: '#34495e'
				}

				scheduleMail(datos,tarea);
				Eventos.insert(evento);

				NewsFeed.insert({
					descripcion: datos.asignado.nombre + 'asignado a la tarea ' + datos.descripcion + ' en el asunto ' + datos.asunto.nombre,
					tipo: 'Tarea',
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					asunto: {
						nombre: datos.asunto.nombre,
						id: datos.asunto.id
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});

				return {
					_id: tarea
				}
			} else {
				return;
			}



		} else {

			return;

		}
	},
	agregarHoraTarea: function (data) {
			check(data,Object)
			console.log(data);
			if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
				console.log(data);
				let tarea = Tareas.find({_id:datos.id}).fetch()[0]
				datos.fecha = new Date(tarea.vence + " GMT-0500");

				datos.horas = parseInt(datos.horas);
				datos.minutos = parseInt(datos.minutos)
				// datos.precio = parseInt(datos.precio);
				datos.horasFacturables = datos.horas;
				datos.minutosFacturables = datos.minutos;

				datos.esTarea = true;
				// datos.cobrable = datos.cobrado;

				// datos.total = datos.horas * datos.precio;
				datos.creadorId = this.userId;
				datos.createdAt = new Date();
				datos.facturado = false;
				datos.descripcion = tarea.descripcion;

				let tareaId = datos.id;
				let datos = {
					hora: datos.horas,
					minutos: datos.minutos
				}
				let horaId = Horas.insert(datos);
				Tareas.update({_id:tareaId},{
					$set:{
						horas:{
							id:horaId,
							hora: datos.hora,
							minutos: datos.minutos
						}
					}
				})


				// Modulo para crear evento sobre que se ha creado una tarea



			} else {

				return;

			}

	},
	crearTareaEtapa:function (datos) {
		check(datos,Object)

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.vence	= new Date();
			datos.abierto = true;

			let tarea = Tareas.insert(datos);
			// Modulo para crear evento sobre que se ha creado una tarea



		} else {

			return;

		}
	},

	actualizarAsuntoTarea(datos){
		check(datos,Object)


		Tareas.update({_id:datos.tareaId}, {
			$set: {
				asunto: datos.asunto,
				etapa: datos.etapa
			}
		})

	},

	actualizarMiembroTarea(tareaId,asignado){
		check(tareaId,String)
		check(asignado,{
			nombre: String,
			id: String
		});


		Tareas.update({_id:tareaId}, {
			$set: {
				asignado: asignado
			}
		})

		var tareas = Tareas.find({_id:tareaId,vence:{$exists:true},asignado:{$exists:true}}).fetch()
		if(tareas.length!=0) scheduleMail(tareas[0],tareas[0]._id);

	},

	actualizarFechaTarea(tareaId,fecha){
		check(tareaId,String)
		check(fecha,String)

		Tareas.update({_id:tareaId},{
			$set:{
				vence: new Date(fecha+" GMT-0500")
			}
		})

		var tareas = Tareas.find({_id:tareaId,vence:{$exists:true},asignado:{$exists:true}}).fetch()
		if(tareas.length!=0) scheduleMail(tareas[0],tareas[0]._id);

	},
	cerrarTarea: function (tareaId) {
		check(tareaId, String);

		if (this.userId) {
			Tareas.update({_id: tareaId}, {
				$set: {
					abierto: false
				}
			});
		} else {
			return;
		}
	},
	agregarComentarioATarea: function (datos) {
		check(datos, {
			comentario: String,
			tareaId: String,
			creador: Object,
			bufeteId: String
		});



		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			// console.log('Entro aqui');
			datos.createdAt = new Date();
			ComentariosDeTareas.insert(datos);

			let tarea = Tareas.find({_id:datos.tareaId}).fetch()[0];
			if(tarea.asunto){

				let asunto = Asuntos.find({_id:tarea.asunto.id}).fetch()[0];

				for (var i = 0; i < asunto.abogados.length; i++) {
					let miembro = Meteor.users.find({_id:asunto.abogados[i].id}).fetch()[0];

					//if(miembro._id===datos.creador.id) return;

					var fechaFormateada = datos.createdAt.getDate() + "/" + (datos.createdAt.getMonth()+1) + "/" + datos.createdAt.getFullYear();

					Email.send({
						to: miembro.emails[0].address,
						from: "notificacion@bunqr.pw",
						subject: 'Notificacion BUNQR',
						html: datos.creador.nombre + " comento la tarea " + tarea.descripcion + " a las " + fechaFormateada + " en el asunto " + asunto.caratula
					})
				}
			}


		} else {
			return;
		}

	},
	crearSubtarea: function (datos) {
		check(datos, {
			descripcion: String,
			tareaId: String,
			bufeteId: String
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			datos.creadorId = this.userId;
			Subtareas.insert(datos);
		} else {
			return;
		}
	},
	agregarTarea: function (datos) {

		let _check = {
			descripcion: String,
			bufeteId: String,
			creador: Object
		}
		if(datos.etapa) _check.etapa = Object;
		if(datos.asunto) _check.asunto = Object;

		check(datos, _check );

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.abierto = true;
			datos.asignado = datos.creador

			let tarea = Tareas.insert(datos);



			// Modulo para crear evento sobre que se ha creado una tarea
			if (tarea) {

				return {
					_id: tarea
				}

			} else {
				return;
			}



		} else {

			return;

		}
	},
	agregarTareaAsunto: function (datos) {

		check(datos, {
			descripcion: String,
			bufeteId: String,
			creador: Object,
			asunto: Object
		});

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.abierto = true;
			datos.asignado = datos.creador
			datos.asunto.nombre = Asuntos.findOne({_id: datos.asunto.id}).caratula

			let tarea = Tareas.insert(datos);



			// Modulo para crear evento sobre que se ha creado una tarea
			if (tarea) {

				return {
					_id: tarea
				}

			} else {
				return;
			}



		} else {

			return;

		}
	},
	crearTareaKanban: function (datos) {
		check(datos, {
			descripcion: String,
			etapa: Object,
			bufeteId: String,
			creador: Object,
			asunto: Object
		});

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.creador.id = this.userId,
			datos.asignado = {
				nombre: datos.creador.nombre,
				id: this.userId
			}

			datos.asunto.nombre = Asuntos.findOne({_id: datos.asunto.id}).caratula;


			datos.abierto = true;
			datos.tipo = 'General';
			datos.createdAt = new Date();


			let tarea = Tareas.insert(datos);

			if (tarea) {
				NewsFeed.insert({
					descripcion: " " + datos.asignado.nombre + ' asignado a la tarea ' + datos.descripcion + ' en el asunto ' + datos.asunto.nombre,
					tipo: 'Tarea',
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					asunto: {
						nombre: datos.asunto.nombre,
						id: datos.asunto.id
					},
					bufeteId: datos.bufeteId,
					createdAt: datos.createdAt
				});
			}
		}
	}
});
