Notas = new Mongo.Collection('notas');

Notas.allow({
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

Notas.deny({
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

EsquemaNotas = new SimpleSchema({
	nombre: {
		type: String
	},
  descripcion: {
    type: String
  },
	bufeteId: {
		type: String
	},
	createdAt: {
		type: Date
	},
	creadorId: {
		type: String
	},
  asuntoId: {
    type: String
  },
	autor: {
		type: String
	},
	fecha: {
		type: Date
	}
});

Notas.attachSchema(EsquemaNotas);
