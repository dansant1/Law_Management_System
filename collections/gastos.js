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
		type: Date
	},
	createdAt: {
		type: Date
	},
	creadorId: {
		type: String
	},
	responsable: {
		type: Object,
		optional:true
	},
	'responsable.nombre': {
		type: String
	},
	'responsable.id': {
		type: String
	},
  	asunto: {
  		type: Object,
		optional:true
  	},
  	'asunto.nombre': {
  		type: String
  	},
  	'asunto.id': {
  		type: String
  	},
	administrativo:{
		type: Boolean,
		optional:true
	},
  	monto: {
    	type: Number,
    	decimal: true
  	}
});

Gastos.attachSchema(EsquemaGastos);
