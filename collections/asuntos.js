Asuntos = new Mongo.Collection('asuntos');

Asuntos.allow({
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

Asuntos.deny({
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

EsquemaAsuntos = new SimpleSchema({
	cliente: {
		type: Object
	},
	'cliente.nombre': {
		type: String
	},
	'cliente.id': {
		type: String
	},
	caratula: {
		type: String
	},
	carpeta: {
		type: String
	},
	area: {
		type: String,
		optional: true
	},
	abogados: {
		type: [Object]
	},
	'abogados.$.id': {
		type: String
	},
	'abogados.$.nombre': {
		type: String
	},
	juzgado: {
		type: String,
		optional: true
	},
	observaciones: {
		type: String,
		optional: true
	},
	inicio: {
		type: Date,
		optional: true
	},
	createdAt: {
		type: Date
	},
	responsable: {
		type: Object
	},
	'responsable.nombre': {
		type: String
	},
	'responsable.id': {
		type: String
	},
	creadorId: {
		type: String
	},
	bufeteId: {
		type: String
	},
	abierto: {
		type: Boolean
	}
});

Asuntos.attachSchema(EsquemaAsuntos);
