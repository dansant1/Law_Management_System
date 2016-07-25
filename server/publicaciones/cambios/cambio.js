Meteor.publish('cambios',function (bufeteId) {

    check(bufeteId,String);

    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['encargado comercial'], 'bufete' ) || Roles.userIsInRole( this.userId, ['socio'], 'bufete' ) ) {
		return Cambio.find({bufeteId:bufeteId})	
	} else {
	this.stop();
		return;
	}

})
