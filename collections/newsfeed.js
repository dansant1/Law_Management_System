NewsFeed = new Mongo.Collection('newsfeed');

NewsFeed.allow({
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

NewsFeed.deny({
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

let EsquemaNewsFeed = new SimpleSchema({
	descripcion: {
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
	tipo: {
		type: String,
		allowedValues: ['Documentos', 'Nota', 'Evento', 'Tarea', 'Expediente', 'Cliente', 'Estado', 'Empresa']
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
	bufeteId: {
		type: String
	},
	createdAt: {
		type: Date
	}

});

NewsFeed.attachSchema(EsquemaNewsFeed);