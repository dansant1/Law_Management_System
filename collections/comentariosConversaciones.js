ComentariosConversaciones = new Mongo.Collection('comentariosconversaciones');

ComentariosConversaciones.allow({
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

ComentariosConversaciones.deny({
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

let EsquemaComentariosConversaciones = new SimpleSchema({
	comentario: {
		type: String
	},
	createdAt: {
		type: Date
	},
	autor: {
		type: Object
	},
	'autor.nombre': {
		type: String
	},
	'autor.id': {
		type: String
	},
	bufeteId: {
		type: String
	},
	conversacionId: {
		type: String
	}
});

ComentariosConversaciones.attachSchema(EsquemaComentariosConversaciones);

/* Comentarios de conversaciones de asunto */

ComentariosConversacionesAsunto = new Mongo.Collection('comentariosconversacionesasunto');

ComentariosConversacionesAsunto.allow({
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

ComentariosConversacionesAsunto.deny({
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

let EsquemaComentariosConversacionesAsunto = new SimpleSchema({
	comentario: {
		type: String
	},
	createdAt: {
		type: Date
	},
	autor: {
		type: Object
	},
	'autor.nombre': {
		type: String
	},
	'autor.id': {
		type: String
	},
	asuntoId: {
		type: String
	},
	conversacionAsuntoId: {
		type: String
	}
});

ComentariosConversacionesAsunto.attachSchema(EsquemaComentariosConversacionesAsunto);

// Comentarios de notas

ComentariosNotas = new Mongo.Collection('comentariosnotas');

ComentariosNotas.allow({
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

ComentariosNotas.deny({
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

let EsquemaComentariosNotas = new SimpleSchema({
	comentario: {
		type: String
	},
	createdAt: {
		type: Date
	},
	autor: {
		type: Object
	},
	'autor.nombre': {
		type: String
	},
	'autor.id': {
		type: String
	},
	contactoId: {
		type: String
	},
	notaId: {
		type: String
	}
});

ComentariosNotas.attachSchema(EsquemaComentariosNotas);