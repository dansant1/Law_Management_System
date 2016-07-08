Meteor.publish('tareas', function (bufeteId) {
	check(bufeteId,String)
	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Tareas.find({bufeteId:bufeteId, abierto: true});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('tareasxAsunto', function (asuntoId) {
	check(asuntoId, String);
	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Tareas.find({'asunto.id': asuntoId, abierto: true});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('tareasxhoy', function () {
	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

		let hoy = new Date()
	    hoy.setHours(0,0,0,0);

	    let mañana = new Date();
	    mañana.setDate(mañana.getDate()+1)
	    mañana.setHours(0,0,0,0)

		return Tareas.find({vence:{$gte:hoy,$lt:mañana}, 'asignado.id': this.userId});

	} else {
		this.stop();
		return;
	}

});



Meteor.publish('tareasCerradas', function () {

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Tareas.find({'creador.id': this.userId, abierto: false});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('Subtareas', function (tareaId) {

	check(tareaId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Subtareas.find({tareaId: tareaId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('MisSubtareas', function (bufeteId) {

	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Subtareas.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('MisComentariosDeTareas', function (bufeteId) {

	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return ComentariosDeTareas.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('MisDocumentosDeTareas', function (bufeteId) {

	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return DocumentosTareas.find({'metadata.bufeteId': bufeteId});
	} else {
		this.stop();
		return;
	}

});



Meteor.publish('misTareas', function () {

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Tareas.find({'asignado.id': this.userId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('etapasTrello', function (asuntoId) {

	check(asuntoId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Etapas.find({'asunto.id': asuntoId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('tareasTrello', function (asuntoId) {

	check(asuntoId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Tareas.find({'asunto.id': asuntoId, abierto: true});
	} else {
		this.stop();
		return;
	}

});
