Meteor.publish('horas', function (bufeteId) {
	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Horas.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('horasxmiembro',function (bufeteId,userId) {
	check(bufeteId, String);
	check(userId, String);
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Horas.find({bufeteId: bufeteId,'responsable.id':userId});
	} else {
		this.stop();
		return;
	}

})


Meteor.publish('horasxAsunto', function (bufeteId, asuntoId) {
	check(bufeteId, String);
	check(asuntoId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Horas.find({bufeteId: bufeteId, 'asunto.id': asuntoId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('MisHoras', function () {

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Horas.find({'responsable.id': this.userId});
	} else {
		this.stop();
		return;
	}
});
