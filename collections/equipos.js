Equipos = new Mongo.Collection('equipos');

Equipos.allow({
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

Equipos.deny({
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

EsquemaEquipos = new SimpleSchema({
	nombre: {
    	type: String
  	},
  	miembros:{
        type: [Object]
    },
    'miembros.$.id':{
        type:String
    },
    'miembros.$.nombre':{
        type: String
    },
	creadorId: {
		type: String
	},
	bufeteId: {
		type: String
	},
	createdAt: {
		type: Date
	}
});

Equipos.attachSchema(EsquemaEquipos);
