Meteor.publish('miCalendario', function () {
	
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
		
		let bufeteId = Meteor.users.findOne({_id: this.userId}).profile.bufeteId;

		return MiCalendario.find({'bufeteId': bufeteId, userId: this.userId});

	} else {
		this.stop();
		return;
	}

});