Meteor.methods({
	agregarCaso: function (datos) {
		check(datos, {
			nombre: String,
			descripcion: String,
			bufeteId: String,
			createdAt: Date,
			contacto: Object,
			creador: Object
		});

		datos.estatus = "abierto";




		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			// datos._id = new Meteor.Collection.ObjectID();

			if ( Clientes.findOne({_id: datos.contacto.id}).estatus === "contacto" ) {
				Clientes.update({_id: datos.contacto.id}, {
					$set: {
						estatus: 'prospecto'
					}
				});
			}

			let caso = Casos.insert(datos);

			if (caso) {

				NewsFeedCasos.insert({
					descripcion: datos.creador.nombre + " agrego un nuevo caso para el contacto " + datos.contacto.nombre,
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					caso: {
						nombre: datos.nombre,
						id: caso
					},
					contacto: {
						nombre: datos.contacto.nombre,
						id: datos.contacto.id
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});
			}

		} else {
			return;
		}
	},
	'agregarNotaCaso': function (datos) {
		check(datos, {
			descripcion: String,
			bufeteId: String,
			createdAt: Date,
			caso: Object,
			creador: Object
		});


		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {


			let casoNota = NotasCasos.insert(datos);

			if (casoNota) {

				NewsFeedCasos.insert({
					descripcion: datos.creador.nombre + " agrego una nota al caso " + datos.caso.nombre,
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					caso: {
						nombre: datos.caso.nombre,
						id: datos.caso.id
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});
			}

		} else {
			return;
		}
	},
	actualizarStatusCaso: function (CasoId, estatus) {
		check(CasoId, String);
		check(estatus, String);

		if (this.userId) {
			Casos.update({_id: CasoId}, {
				$set: {
					estatus: estatus
				}
			});
		}
	},
	eliminarCaso: function (CasoId) {
		check(CasoId, String);
		if (this.userId) {
			let caso = Casos.findOne({_id: CasoId});
			Casos.remove({_id: CasoId});

			NewsFeedCasos.insert({
					descripcion: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido + " eliminó el caso " + caso.nombre + " de " + caso.contacto.nombre,
					creador: {
						nombre: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido,
						id: this.userId
					},
					caso: {
						nombre: caso.nombre,
						id: CasoId
					},
					contacto: {
						nombre: caso.contacto.nombre,
						id: caso.contacto.id
					},
					bufeteId: caso.bufeteId,
					createdAt: new Date()
				});
		} else {
			return;
		}
	}
});
