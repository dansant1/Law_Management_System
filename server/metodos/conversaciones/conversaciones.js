Meteor.methods({
	'agregarConversacion': function (datos) {
		check(datos, {
			nombre: String,
			descripcion: String,
			bufeteId: String,
			autor: String
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			datos.creadorId = this.userId;
			Conversaciones.insert(datos);
		} else {
			return;
		}

	},
	'agregarComentarioAConversacion': function (datos) {
		check(datos, {
			comentario: String,
			bufeteId: String,
			conversacionId: String,
			autor: Object
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			ComentariosConversaciones.insert(datos);
		} else {
			return;
		}
	}
});

Meteor.methods({
	'agregarConversacionAsunto': function (datos) {
		check(datos, {
			nombre: String,
			descripcion: String,
			asuntoId: String,
			autor: String
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			datos.creadorId = this.userId;
			ConversacionesAsunto.insert(datos);
		} else {
			return;
		}

	},
	'agregarComentarioAConversacionAsunto': function (datos) {
		check(datos, {
			comentario: String,
			asuntoId: String,
			conversacionAsuntoId: String,
			autor: Object
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			ComentariosConversacionesAsunto.insert(datos);
		} else {
			return;
		}
	}
});

Meteor.methods({
	'agregarConversacionNota': function (datos) {
		check(datos, {
			nombre: String,
			descripcion: String,
			contactoId: String,
			autor: String,
			bufeteId: String
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			datos.creadorId = this.userId;
			ConversacionesNota.insert(datos);
		} else {
			return;
		}

	},
	'agregarComentarioAConversacionNota': function (datos) {
		check(datos, {
			comentario: String,
			contactoId: String,
			notaId: String,
			autor: Object
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			ComentariosNotas.insert(datos);
		} else {
			return;
		}
	}
});