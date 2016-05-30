// Definimos el storage adapter GridFS
let docStore = new FS.Store.GridFS("documentos", {
  maxTries: 3
});


// Creamos la DB para Documentos
Documentos = new FS.Collection("documentos", {
  stores: [docStore]
});

// agregamos los permisos allow/deny
Documentos.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});


// Coleccion para carpetaModal

Carpetas = new Mongo.Collection('carpetas');

Carpetas.allow({
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

Carpetas.deny({
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

EsquemaCarpetas = new SimpleSchema({
	cliente: {
		type: Object,
    optional: true
	},
	'cliente.nombre': {
		type: String
	},
	'cliente.id': {
		type: String
	},
	nombre: {
		type: String
	},
	descripcion: {
		type: String,
    optional: true
	},
	createdAt: {
		type: Date
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
	creador: {
		type: Object
	},
  'creador.nombre': {
    type: String
  },
  'creador.id': {
    type: String
  },
	bufeteId: {
		type: String
	},
  padreId: {
    type: String,
    optional: true
  },
  subcarpeta: {
    type: Boolean
  }
});

Carpetas.attachSchema(EsquemaCarpetas);



// Recibos

// Definimos el storage adapter GridFS
let reciboStore = new FS.Store.GridFS("recibos", {
  maxTries: 3
});


// Creamos la DB para Recibos
Recibos = new FS.Collection("recibos", {
  stores: [reciboStore]
});

// agregamos los permisos allow/deny
Recibos.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

// Plantillas

// Definimos el storage adapter GridFS
let plantillaStore = new FS.Store.GridFS("plantillas", {
  maxTries: 3
});


// Creamos la DB para Plantillas
Plantillas = new FS.Collection("plantillas", {
  stores: [plantillaStore]
});

// agregamos los permisos allow/deny
Plantillas.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});


// Logo de Bufetes

// Definimos el storage adapter GridFS
let logosStore = new FS.Store.GridFS("logos", {
  maxTries: 3
});


// Creamos la DB para Plantillas
Logos = new FS.Collection("logos", {
  stores: [logosStore]
});

// agregamos los permisos allow/deny
Logos.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});


// Definimos el storage adapter GridFS
let docTareasStore = new FS.Store.GridFS("documentosTareas", {
  maxTries: 5
});


// Creamos la DB para Documentos
DocumentosTareas = new FS.Collection("documentosTareas", {
  stores: [docTareasStore]
});

// agregamos los permisos allow/deny
DocumentosTareas.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});