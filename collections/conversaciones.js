Conversaciones = new Mongo.Collection('conversaciones');

Conversaciones.allow({
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

Conversaciones.deny({
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

EsquemaConvesarciones = new SimpleSchema({
	nombre: {
    	type: String
  	},
  	descripcion: {
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
	},
	autor: {
		type: String
	}
});

Conversaciones.attachSchema(EsquemaConvesarciones);

/* Conversaciones por asuntos */

ConversacionesAsunto = new Mongo.Collection('conversacionesasunto');

ConversacionesAsunto.allow({
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

ConversacionesAsunto.deny({
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

EsquemaConversacionesAsunto = new SimpleSchema({
	nombre: {
    	type: String
  	},
  	descripcion: {
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
	}
});

ConversacionesAsunto.attachSchema(EsquemaConversacionesAsunto);

// Notas de contacto

ConversacionesNota = new Mongo.Collection('conversacionesnota');

ConversacionesNota.allow({
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

ConversacionesNota.deny({
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

EsquemaConversacionesNota = new SimpleSchema({
	nombre: {
    	type: String
  	},
  	descripcion: {
    	type: String
  	},
	createdAt: {
		type: Date
	},
	creadorId: {
		type: String
	},
	contactoId: {
		type: String
	},
	autor: {
		type: String
	},
	bufeteId: {
		type: String
	}
});

ConversacionesNota.attachSchema(EsquemaConversacionesNota);
