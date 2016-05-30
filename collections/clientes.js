Clientes = new Mongo.Collection('clientes');


Clientes.allow({
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

Clientes.deny({
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

EsquemaClientes = new SimpleSchema({
	nombre: {
		type: String
	},
	apellido: {
		type: String,
		optional: true
	},
	telefono: {
		type: String,
		optional: true
	},
	celular: {
		type: String,
		optional: true
	},
	direccion: {
		type: String,
		optional: true
	},
	provincia: {
		type: String,
		optional: true
	},
	pais: {
		type: String,
		optional: true
	},
	identificacion: {
		type: String,
		optional: true
	},
	email: {
		type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
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
	autor: {
		type: String
	},
	archivado: {
		type: Boolean
	}
});

Clientes.attachSchema(EsquemaClientes);

// Coleccion Empresas

Empresas = new Mongo.Collection('empresas');


Empresas.allow({
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

Empresas.deny({
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

EsquemaEmpresas = new SimpleSchema({
	nombre: {
		type: String
	},
	telefono: {
		type: String,
		optional: true
	},
	celular: {
		type: String,
		optional: true
	},
	direccion: {
		type: String,
		optional: true
	},
	provincia: {
		type: String,
		optional: true
	},
	pais: {
		type: String,
		optional: true
	},
	identificacion: {
		type: String,
		optional: true
	},
	email: {
		type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
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
	autor: {
		type: String
	},
	archivado: {
		type: Boolean
	}
});

Empresas.attachSchema(EsquemaEmpresas);