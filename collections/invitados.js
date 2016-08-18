Invitados = new Mongo.Collection('invitados');

Invitados.allow({
	insert: () => {
		return false;
	},
	update: () => {
		return false;
	},
	remove: () => {
		return false;
	}
});

Invitados.deny({
	insert: () => {
		return true;
	},
	update: () => {
		return true;
	},
	remove: () => {
		return true;
	}
});

EsquemaInvitados = new SimpleSchema({
	nombre: {
		type: String
	},
	apellido: {
		type: String
	},
	bufete: {
		type: String
	},
	email: {
		type: String,
	},
	tipo: {
		type: String
	},
	area: {
		type: Object
	},
	bufeteId: {
		type: String
	}
});

Invitados.attachSchema(EsquemaInvitados);
