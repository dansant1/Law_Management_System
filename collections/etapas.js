Etapas = new Mongo.Collection('etapas');

Etapas.allow({
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

Etapas.deny({
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

EsquemaEtapas = new SimpleSchema({
	bufeteId: {
		type: String
	},
	asunto:{
		type: Object
	},
	'asunto.id':{
		type: String
	},
	'asunto.nombre':{
		type: String
	},
	nombre: {
		type: String
	},
	abierto: {
		type: Boolean,
		optional: true
	}
});

Etapas.attachSchema(EsquemaEtapas);
