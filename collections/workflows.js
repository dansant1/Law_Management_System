Workflows = new Mongo.Collection('workflows');

Workflows.allow({
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

Workflows.deny({
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

EsquemaWorkflows = new SimpleSchema({
	bufeteId: {
		type: String
	},
	tareas: {
		type: [Object]
	},
	'tareas.descripcion': {
		type: String
	},
	'tareas.duracion': {
		type: Number
	},
	'tareas.asignado': {
		type: String,
		optional: true
	},
	equipoId: {
		type: String,
		optional: true
	},
	nombre: {
		type: String
	},
	createdAt: {
		type: Date
	},
	creador: {
		type: Object
	},
	'creador.nombre': {
		type: String
	},
	'creador.id': {
		type: String
	}
});

Etapas.attachSchema(EsquemaEtapas);
