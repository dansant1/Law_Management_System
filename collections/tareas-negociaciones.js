TareasNegociaciones = new Mongo.Collection('tareascrm');

TareasNegociaciones.allow({
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

TareasNegociaciones.deny({
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

EsquemaTareasNegociaciones  = new SimpleSchema({
	bufeteId: {
		type: String
	},
	descripcion: {
		type: String
	},
	vence: {
		type: Date,
		optional: true
	},
	asignado: {
		type: Object,
		optional: true
	},
	'asignado.nombre': {
		type: String,
	},
	'asignado.id': {
		type: String
	},
	casoId: {
		type: String
	}
});

TareasNegociaciones.attachSchema(EsquemaTareasNegociaciones );
