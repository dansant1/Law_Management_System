Estados = new Mongo.Collection('estados');

Estados.allow({
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

Estados.deny({
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

EsquemaEstados = new SimpleSchema({
		nombre: {
    	type: String
  	},
  	descripcion: {
    	type: String,
    	optional: true
  	},
  	asuntoId: {
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
		fecha: {
			type: Date
		},
		autor: {
			type: String
		}
});

Estados.attachSchema(EsquemaEstados);
