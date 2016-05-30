Meteor.publish('comentarioDeTareas', function (tareaId, bufeteId) {

	check(tareaId, String);
	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return ComentariosDeTareas.find({tareaId: tareaId, bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}

});