Meteor.publish('gastos', function (bufeteId) {
	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['encargado comercial'], 'bufete' )) {
		return Gastos.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('gastosxAsunto', function (bufeteId, asuntoId) {
	check(bufeteId, String);
	check(asuntoId, String);
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['encargado comercial'], 'bufete' )) {
		return Gastos.find({bufeteId: bufeteId, 'asunto.id': asuntoId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('gastosxmiembro',function (bufeteId) {

    check(bufeteId,String)
    if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['encargado comercial'], 'bufete' )) {

        let asuntosId = _(Asuntos.find({abogados:{$elemMatch:{id:this.userId}}}).fetch()).map(function (asunto) {
            return asunto.id;
        })

		return Gastos.find({bufeteId: bufeteId, 'asunto.id': {$in:asuntoId}});
	} else {
		this.stop();
		return;
	}

})

Meteor.publish('ultimosGastos', function (bufeteId) {
	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['encargado comercial'], 'bufete' )) {
		return Gastos.find({bufeteId: bufeteId, administrativo: true}, {limit: 6});
	} else {
		this.stop();
		return;
	}
});
