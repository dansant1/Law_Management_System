// Base de datos para casos del CRM - contactos

Casos = new Mongo.Collection('casos');

Casos.allow({
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

Casos.deny({
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

EsquemaCasos = new SimpleSchema({
	nombre: {
		type: String
	},
	descripcion: {
		type: String,
		optional: true
	},
	bufeteId: {
		type: String
	},
	createdAt: {
		type: Date
	},
	contacto: {
		type: Object
	},
	'contacto.nombre': {
		type: String
	},
	'contacto.id': {
		type: String
	},
	estatus:{
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
	}
});

Casos.attachSchema(EsquemaCasos);

// Base de datos para Notas de Casos

NotasCasos = new Mongo.Collection('notascasos');

NotasCasos.allow({
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

NotasCasos.deny({
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

EsquemaNotasCasos = new SimpleSchema({
	descripcion: {
		type: String,
		optional: true
	},
	bufeteId: {
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

NotasCasos.attachSchema(EsquemaNotasCasos);


// Base de datos para Tareas de Casos

TareasCasos = new Mongo.Collection('tareascasos');

TareasCasos.allow({
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

TareasCasos.deny({
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

EsquemaTareasCasos = new SimpleSchema({
	descripcion: {
		type: String,
		optional: true
	},
	bufeteId: {
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
	},
	caso: {
		type: Object
	},
	'caso.nombre': {
		type: String
	},
	'caso.id': {
		type: String
	},
	vence: {
		type: String
	},
	fecha: {
		type: Date
	},
	asignado: {
		type: String
	},
	'asignado.nombre': {
		type: String
	},
	'asignado.id': {
		type: String
	}
});

TareasCasos.attachSchema(EsquemaTareasCasos);

// Base de datos para Documentos relacionado con Casos

// Definimos el storage adapter GridFS
let docStoreCasos = new FS.Store.GridFS("documentoscasos", {
  maxTries: 4
});


// Creamos la DB para Documentos
DocumentosCasos = new FS.Collection("documentoscasos", {
  stores: [docStoreCasos]
});

// agregamos los permisos allow/deny
DocumentosCasos.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

// Base de datos para NewsFeed de Casos

NewsFeedCasos = new Mongo.Collection('newsfeedcasos');

NewsFeedCasos.allow({
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

NewsFeedCasos.deny({
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

let EsquemaNewsFeedCasos = new SimpleSchema({
	descripcion: {
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
	caso: {
		type: Object,
		optional: true
	},
	'caso.nombre': {
		type: String
	},
	'caso.id': {
		type: String
	},
	'contacto': {
		type: Object,
		optional: true
	},
	'contacto.nombre': {
		type: String
	},
	'contacto.id': {
		type: String
	},
	bufeteId: {
		type: String
	},
	createdAt: {
		type: Date
	}
});

NewsFeedCasos.attachSchema(EsquemaNewsFeedCasos);