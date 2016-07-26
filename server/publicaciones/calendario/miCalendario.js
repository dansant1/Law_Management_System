Meteor.publish('miCalendario', function () {

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

		let bufeteId = Meteor.users.findOne({_id:this.userId}).profile.bufeteId;

		return MiCalendario.find({'bufeteId': bufeteId, 'creador.id': this.userId});

	} else {
		this.stop();
		return;
	}

});

Meteor.publish('eventosxhoy',function () {
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

		let hoy = new Date()
	    hoy.setHours(0,0,0,0);

	    let mañana = new Date();
	    mañana.setDate(mañana.getDate()+1)
	    mañana.setHours(0,0,0,0)

		console.log('[ID del Usuario]',this.userId);
		return MiCalendario.find({end:{$gte:hoy,$lt:mañana}, userId: this.userId});

	} else {
		this.stop();
		return;
	}

})
