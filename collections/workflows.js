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
	etapas:{
		type:[Object]
	},
	'etapas.$.nombre':{
		type:String
	},

	'etapas.$.tareas': {
		type: [Object]
	},
	'etapas.$.tareas.$.descripcion': {
		type: String
	},
	'etapas.$.tareas.$.duracion': {
		type: Number,
		optional:true
	},
	'etapas.$.tareas.$.asignado': {
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
		type: Date,
		defaultValue: new Date()
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

Workflows.attachSchema(EsquemaWorkflows);
