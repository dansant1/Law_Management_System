Bufetes = new Mongo.Collection('bufetes');

Bufetes.allow({
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

Bufetes.deny({
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

EsquemaBufetes = new SimpleSchema({
	nombre: {
		type: String	
	}
});

Bufetes.attachSchema(EsquemaBufetes);
