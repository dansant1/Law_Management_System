Meteor.methods({
	crearTarea: function (datos) {

		let _check = {
			descripcion: String,
			fecha: String,
			asunto: Object,
			tipo: String,
			bufeteId: String,
			creador: Object,
<<<<<<< HEAD
		}

		if(datos.asignado) _check.asignado = Object;

		check(datos, _check);
=======
			asignado: Object
		});
>>>>>>> 921048ad723d1037e4b74a453598d95b762ba2c0

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.vence	= new Date(datos.fecha);
			datos.abierto = true;

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

				Eventos.insert(evento);
				NewsFeed.insert({
					descripcion: 'asignado a la tarea ' + datos.descripcion + ' en el asunto ' + datos.asunto.nombre,
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
			datos.createdAt = new Date();
			ComentariosDeTareas.insert(datos);
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
			datos.creadorId = thia.userId;
			Subtareas.insert(datos);
		} else {
			return;
		}
	},
	agregarTarea: function (datos) {

		check(datos, {
			descripcion: String,
			bufeteId: String,
			creador: Object
		});

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
	}
});
