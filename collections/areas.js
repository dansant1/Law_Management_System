Areas = new Mongo.Collection('areas');

Areas.allow({
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

Areas.deny({
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

EsquemaAreas = new SimpleSchema({
	nombre: {
		type: String
	},
	bufeteId: {
		type: String
	}
});

Areas.attachSchema(EsquemaAreas);
