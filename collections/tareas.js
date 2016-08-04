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
		type: String,
        optional:true
	},
    detalles:{
        type:String,
        optional:true
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
        type: Date,
        defaultValue: new Date()
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
        type: Object,
        optional:true
    },
    etapa:{
        type: Object,
        optional:true
    },
    'etapa.nombre':{
        type:String
    },
    'horas':{
        type:Object,
        optional:true
    },
    'horas.id':{
        type:String
    },
    'horas.hora':{
        type:Number
    },
    'horas.minutos':{
        type:Number
    },
    'etapa.id':{
        type:String
    },
    'asignado.nombre': {
        type: String
    },
    'asignado.id': {
        type: String
    }
});

Tareas.attachSchema(EsquemaTareas);
