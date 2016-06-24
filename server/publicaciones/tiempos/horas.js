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



Meteor.publish('gastos', function (bufeteId) {
	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Gastos.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('gastosxAsunto', function (bufeteId, asuntoId) {
	check(bufeteId, String);
	check(asuntoId, String);
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {
		return Gastos.find({bufeteId: bufeteId, 'asunto.id': asuntoId});
	} else {
		this.stop();
		return;
	}
});
