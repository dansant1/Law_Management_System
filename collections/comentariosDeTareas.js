ComentariosDeTareas = new Mongo.Collection('comentariostareas');

ComentariosDeTareas.allow({
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

ComentariosDeTareas.deny({
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

EsquemaComentariosDeTareas = new SimpleSchema({
  	comentario: {
    	type: String
  	},
  	tareaId: {
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

ComentariosDeTareas.attachSchema(EsquemaComentariosDeTareas);


