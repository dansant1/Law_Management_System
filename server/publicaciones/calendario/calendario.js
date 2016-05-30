Meteor.publish('eventos', function () {
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
		let bufeteId = Meteor.users.findOne({_id: this.userId}).profile.bufeteId;

		return Eventos.find({'bufeteId': bufeteId});

	} else {
		this.stop();
		return;
	}
});

Meteor.publish('eventosxAsunto', function (asuntoId) {
	check(asuntoId, String);
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
		let bufeteId = Meteor.users.findOne({_id: this.userId}).profile.bufeteId;

		return Eventos.find({'asunto.id': asuntoId});

	} else {
		this.stop();
		return;
	}
});

Meteor.publish('eventosPropios', function () {
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
		let bufeteId = Meteor.users.findOne({_id: this.userId}).profile.bufeteId;

		return Eventos.find({'creador.id': this.userId});

	} else {
		this.stop();
		return;
	}
});