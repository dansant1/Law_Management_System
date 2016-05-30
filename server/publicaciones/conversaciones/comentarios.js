Meteor.publish('comentariosDeConversaciones', function (bufeteId) {
	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return ComentariosConversaciones.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('comentariosDeConversacionesAsunto', function (asuntoId) {
	check(asuntoId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return ComentariosConversacionesAsunto.find({asuntoId: asuntoId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('comentariosDeConversacionesNota', function (contactoId) {
	check(contactoId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return ComentariosNotas.find({contactoId: contactoId});
	} else {
		this.stop();
		return;
	}

});