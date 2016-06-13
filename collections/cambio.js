Cambio = new Mongo.Collection('cambio');

Cambio.allow({
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

Cambio.deny({
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

EsquemaCambio = new SimpleSchema({
	bufeteId: {
		type: String
	},
	cambio: {
		type: Number,
		decimal: true
	}
});

Cambio.attachSchema(EsquemaCambio);