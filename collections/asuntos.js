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
	facturacion:{
		type:Object,
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
		type:String,
		optional: true
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
	'facturacion.tipo_moneda':{
		type:String
	},
	abierto: {
		type: Boolean
	}
});

Asuntos.attachSchema(EsquemaAsuntos);
