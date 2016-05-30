Eventos = new Mongo.Collection('eventos');

Eventos.allow({
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

Eventos.deny({
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

let EsquemaEventos = new SimpleSchema({
	title: {
		type: String
	},
	start: {
		type: String
	},
	end: {
		type: String
	},
	color: {
		type: String,
		optional: true
	},
	'asunto': {
		type: Object
	},
	'asunto.nombre': {
		type: String
	},
	'asunto.id': {
		type: String
	},
	creador: {
		type: Object
	},
	'creador.nombre': {
		type: String
	},
	'creador.id': {
		type: String
	},
	bufeteId: {
		type: String
	},
	createdAt: {
		type: Date
	}
});

Eventos.attachSchema(EsquemaEventos);


