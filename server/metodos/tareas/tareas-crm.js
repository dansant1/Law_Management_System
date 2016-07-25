Meteor.methods({
	crearTareaCRM: function (datos) {
		check(datos, {
			descripcion: String,
			vence: Date,
			asignado: Object,
			casoId: String
		});

		if (this.userId) {
			datos.bufeteId = Meteor.users.findOne({_id: this.userId}).profile.bufeteId;
			datos.abierto = true;
			var tarea = TareasNegociaciones.insert(datos);
			if (tarea) {
				NewsFeedCasos.insert({
					descripcion: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido + " creó la tarea " + datos.descripcion + " en la negociación " + Casos.findOne({_id: datos.casoId}).nombre,
					creador: {
						nombre: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido,
						id: this.userId
					},
					caso: {
						nombre: Casos.findOne({_id: datos.casoId}).nombre,
						id: datos.casoId
					},
					bufeteId:  Meteor.users.findOne({_id: this.userId}).profile.bufeteId,
					createdAt: new Date()
				});
			}
		}

	},
	crearTareaCRMRapido: function (datos) {
		check(datos, {
			descripcion: String,
			asignado: Object,
			casoId: String
		});

		if (this.userId) {
			datos.bufeteId  = Meteor.users.findOne({_id: this.userId}).profile.bufeteId;
			datos.abierto = true;
			var tarea = TareasNegociaciones.insert(datos);
			if (tarea) {
				NewsFeedCasos.insert({
					descripcion: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido + " creó la tarea " + datos.descripcion + " en la negociación " + Casos.findOne({_id: datos.casoId}).nombre,
					creador: {
						nombre: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido,
						id: this.userId
					},
					caso: {
						nombre: Casos.findOne({_id: datos.casoId}).nombre,
						id: datos.casoId
					},
					bufeteId:  Meteor.users.findOne({_id: this.userId}).profile.bufeteId,
					createdAt: new Date()
				});
			}
		}
	},
	cerrarTareaCRM: function (tareaId) {
			check(tareaId, String);

			if (this.userId) {
				TareasNegociaciones.update({_id: tareaId}, {
					$set: {
						abierto: false
					}
				});
			} else {
				return;
			}
	},
	abrirTareaCRM: function (tareaId) {
			check(tareaId, String);

			if (this.userId) {
				TareasNegociaciones.update({_id: tareaId}, {
					$set: {
						abierto: true
					}
				});
			} else {
				return;
			}
	}
});
