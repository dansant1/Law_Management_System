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

Meteor.publish('gastosxmiembro',function (bufeteId) {

    check(bufeteId,String)
    if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )) {

        let asuntosId = _(Asuntos.find({abogados:{$elemMatch:{id:this.userId}}}).fetch()).map(function (asunto) {
            return asunto.id;
        })

		return Gastos.find({bufeteId: bufeteId, 'asunto.id': {$in:asuntoId}});
	} else {
		this.stop();
		return;
	}

})
