Subtareas = new Mongo.Collection('subtareas');

Subtareas.allow({
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

Subtareas.deny({
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

EsquemaSubtareas = new SimpleSchema({
  	descripcion: {
    	type: String,
  	},
  	tareaId: {
    	type: String
  	},
	createdAt: {
		type: Date
	},
	creadorId: {
		type: String
	},
	bufeteId: {
		type: String
	}
});

Subtareas.attachSchema(EsquemaSubtareas);