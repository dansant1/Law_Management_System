ComentariosDeArchivo = new Mongo.Collection('comentariosarchivo');

ComentariosDeArchivo.allow({
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

ComentariosDeArchivo.deny({
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

EsquemaComentariosDeArchivo = new SimpleSchema({
  comentario: {
    type: String
  },
  archivoId: {
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

ComentariosDeArchivo.attachSchema(EsquemaComentariosDeArchivo);
