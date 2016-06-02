  Tareas = new Mongo.Collection('tareas');

if ( Meteor.isServer ) {
  Tareas._ensureIndex( { descripcion: 1, 'asunto.nombre': 1, tipo: 1 } );
}

Tareas.allow({
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

Tareas.deny({
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

EsquemaTareas = new SimpleSchema({
	descripcion: {
		type: String
	},
	vence: {
    type: Date,
    optional: true
	},
  fecha: {
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
  'asunto.id': {
    type: String
  },
  'asunto.nombre': {
    type: String
  },
  tipo: {
    type: String,
    allowedValues: ['General', 'Comunicaciones', 'Escritos', 'Tribunales', 'Facturacion'],
    optional: true
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
  abierto: {
    type: Boolean
  },
  asignado: {
    type: Object
  },
  'asignado.nombre': {
    type: String
  },
  'asignado.id': {
    type: String
  }
});

Tareas.attachSchema(EsquemaTareas);
