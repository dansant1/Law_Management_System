Meteor.methods({
	
	cerrarAsunto: function (asuntoId) {
			console.log(asuntoId)
			check(asuntoId,String);
			if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) Asuntos.update({_id: asuntoId}, {$set: {abierto: false}});

	},
	crearAsunto: function (asuntos) {

		check(asuntos, {
			cliente: Object,
			caratula: String,
			carpeta: String,
			abogados: [Object],
			area: String,
			juzgado: String,
			observaciones: String,
			inicio: String,
			responsable: Object,
			bufeteId: String
		});

		if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) {
			asuntos.createdAt = new Date();

			

			if (asuntos.inicio !== "") {
				asuntos.inicio	= new Date(asuntos.inicio);	
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
						nombre: asuntos.responsable.nombre,
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
