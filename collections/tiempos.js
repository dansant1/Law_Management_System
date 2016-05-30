Horas = new Mongo.Collection('horas');

Horas.allow({
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

Horas.deny({
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

EsquemaHoras = new SimpleSchema({
  	descripcion: {
    	type: String
  	},
	bufeteId: {
		type: String
	},
	fecha: {
		type: String
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
	createdAt: {
		type: Date
	},
	creadorId: {
		type: String
	},
	asunto: {
		type: Object,
		optional: true
	},
	'asunto.nombre': {
		type: String
	},
	'asunto.id': {
		type: String
	},
	horas: {
		type: Number,
		decimal: true
	},
  	precio: {
    	type: Number,
    	decimal: true
  	},
  	total: {
  		type: Number,
  		decimal: true
  	}
});

Horas.attachSchema(EsquemaHoras);

// Coleccion para gastos
Gastos = new Mongo.Collection('gastos');

Gastos.allow({
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

Gastos.deny({
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

EsquemaGastos = new SimpleSchema({
  	descripcion: {
    	type: String
  	},
	bufeteId: {
		type: String
	},
	fecha: {
		type: String
	},
	createdAt: {
		type: Date
	},
	creadorId: {
		type: String
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
  	asunto: {
  		type: Object
  	},
  	'asunto.nombre': {
  		type: String
  	},
  	'asunto.id': {
  		type: String
  	},
  	monto: {
    	type: Number,
    	decimal: true
  	}
});

Gastos.attachSchema(EsquemaGastos);
