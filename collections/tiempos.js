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
    	type: String,
		optional:true
  	},
	bufeteId: {
		type: String
	},
	fecha: {
		type: Date
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
		type: Number
	},
	minutos: {
		type: Number,
		optional: true
	},
	esTarea: {
		type: Boolean,
		optional:true
	},
	horasFacturables: {
		type: Number
	},
	minutosFacturables: {
		type: Number
	},
	cobrable: {
		type: Boolean,
		optional:true
	},
	precio:{
		type:Number,
		decimal:true,
		optional:true
	},
	facturado: {
		type: Boolean
	},
	bloqueado: {
		type: Boolean,
		optional:true
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


// Bases de datos para el modulo Facturacion

Cobros = new Mongo.Collection('cobros');

Cobros.allow({
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

Cobros.deny({
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

EsquemaCobros = new SimpleSchema({
  	descripcion: {
    	type: String
  	},
  	cliente: {
  		type: Object
  	},
  	'cliente.nombre': {
  		type: String
  	},
  	'cliente.id': {
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
	estado: {
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
  	asunto: {
  		type: Object
  	},
  	'asunto.nombre': {
  		type: String
  	},
  	'asunto.id': {
  		type: String
  	},
  	moneda: {
  		type: String
  	},
  	tipoTarifa: {
  		type: String
  	},
  	numero: {
  		type: Number
  	}
});

Cobros.attachSchema(EsquemaCobros);
