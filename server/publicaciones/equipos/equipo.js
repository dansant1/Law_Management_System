Meteor.publish('equipo', function (bufeteId) {

	check(bufeteId, String);

	if (this.userId) {
		return Meteor.users.find( { "profile.bufeteId": bufeteId }, { fields: { "profile.nombre": 1, "profile.apellido": 1,emails:1,'profile.telefono':1,roles:1} } );
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('miequipo',function (equipoId) {
	check(equipoId,String)
	if(this.userId){
		return Equipos.find({_id:equipoId})
	}else {
		this.stop();
		return;
	}
})

Meteor.publish('misequipos',function (bufeteId) {
	check(bufeteId,String)
	if (this.userId) {
		return Equipos.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('miembroDelEquipo', function (miembroId) {

	check(miembroId, String);

	if (this.userId) {
		return Meteor.users.find( { _id: miembroId });
	} else {
		this.stop();
		return;
	}

});
