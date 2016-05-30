MensajesAsunto = new Mongo.Collection('mensajeasunto');

MensajesAsunto.allow({
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

MensajesAsunto.deny({
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

EsquemaMensajesAsunto = new SimpleSchema({
	mensaje: {
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
  asuntoId: {
    type: String
  },
  createdAt: {
    type: Date
  }
});

MensajesAsunto.attachSchema(EsquemaMensajesAsunto);
