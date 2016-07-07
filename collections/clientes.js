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
	facturacion:{
		type:Object,
		optional:true
	},
	empresa:{
		type:Object,
		optional:true
	},
	'empresa.ruc':{
		type:String,
		optional:true
	},
	'empresa.nombre':{
		type:String,
		optional:true
	},
	'facturacion.ruc':{
		type:String
	},
	'facturacion.direccion':{
		type:String
	},
	'facturacion.telefono':{
		type:String
	},
	'facturacion.solicitante':{
		type:Object,
		optional:true
	},
	'facturacion.solicitante.nombre':{
		type:String,
		optional:true
	},
	'facturacion.solicitante.telefono':{
		type:String,
		optional:true
	},
	'facturacion.solicitante.correo':{
		type:String,
		regEx: SimpleSchema.RegEx.Email,
		optional:true
	},

	'facturacion.tarifa':{
		type:Object
	},
	'facturacion.tarifa.id':{
		type:String
	},
	'facturacion.tarifa.nombre':{
		type:String
	},
	'facturacion.tipo_moneda':{
		type:String
	},
	'facturacion.descuento.tipo':{
		type:String
	},
	'facturacion.descuento.valor':{
		type:String
	},
	'facturacion.forma_cobro':{
		type:String
	},
	'facturacion.cobranza':{
		type:String
	},
	'facturacion.alertas':{
		type:Object
	},
	'facturacion.alertas.horas':{
		type:Number,
		decimal:true
	},
	'facturacion.alertas.monto':{
		type:Number,
		decimal:true
	},
	'facturacion.alertas.horas_no_cobradas':{
		type:Number,
		decimal:true
	},
	'facturacion.alertas.monto_horas_no_cobradas':{
		type:Number,
		decimal:true
	},
	nombreCompleto:{
		type:String
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
	},
	estatus:{
		type: String
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
	ruc:{
		type:String
	},
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
