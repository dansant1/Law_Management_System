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
		type:String,
		optional:true

	},
	'facturacion.direccion':{
		type:String,
		optional:true

	},
	'facturacion.telefono':{
		type:String,
		optional:true

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
		type:Object,
		optional:true
	},
	'facturacion.montogeneral':{
		type:String,
		optional:true
	},
	'facturacion.retainer':{
		type:Object,
		optional:true
	},
	'facturacion.retainer.monto':{
		type:Number,
		optional:true
	},
	'facturacion.retainer.horas_maxima':{
		type:Number,
		optional:true
	},
	'facturacion.tarifa.id':{
		type:String
	},
	'facturacion.tarifa.nombre':{
		type:String,
		optional:true

	},
	'facturacion.descuento.tipo':{
		type:String,
		optional:true

	},
	'facturacion.descuento.valor':{
		type:String,
		optional:true
	},
	'facturacion.forma_cobro':{
		type:String
	},
	'facturacion.excedido':{
		type:Boolean,
		optional:true
	},
	'facturacion.cobranza':{
		type:String,
		optional: true
	},
	'facturacion.alertas':{
		type:Object,
		optional:true
	},
	'facturacion.alertas.horas':{
		type:Number,
		decimal:true,
		optional:true
	},
	'facturacion.alertas.monto':{
		type:Number,
		decimal:true,
		optional:true
	},
	'facturacion.alertas.horas_no_cobradas':{
		type:Number,
		decimal:true,
		optional:true
	},
	'facturacion.alertas.monto_horas_no_cobradas':{
		type:Number,
		decimal:true,
		optional:true
	},
	'facturacion.tipo_moneda':{
		type:String,
		optional:true
	},
	abierto: {
		type: Boolean
	}
});

Asuntos.attachSchema(EsquemaAsuntos);
