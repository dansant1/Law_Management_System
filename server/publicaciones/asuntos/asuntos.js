// Todas las publicaciones de asuntos

Meteor.publish('asuntos', function (bufeteId) {
	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

		return Asuntos.find({bufeteId: bufeteId});

	} else {

		this.stop();
    	return;

	}

});

Meteor.publish('asuntosxequipo',function (miembroId,bufeteId) {
	check(miembroId, String);
	check(bufeteId,String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {


		return Asuntos.find({$and:[
				{"$or":[{"abogados":{"$elemMatch":{id:miembroId}} },{creadorId:miembroId},{abogados:{$size:0}}]},
				{bufeteId:bufeteId}
			]
		});


	} else {

		this.stop();
		return;

	}
})


Meteor.publish('asuntosxCliente', function (contactoId) {

	check(contactoId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

		return Asuntos.find({'cliente.id': contactoId});

	} else {

		this.stop();
    	return;

	}

});

Meteor.publish('expediente', function (asuntoId) {

	check(asuntoId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

		return Asuntos.find({_id: asuntoId});

	} else {

		this.stop();
    	return;

	}

});
