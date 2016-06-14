Meteor.publish('cambios',function (bufeteId) {

    check(bufeteId,String);


    return Cambio.find({bufeteId:bufeteId})
    // if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
	// } else {
	// 	this.stop();
	// 	return;
	// }

})
