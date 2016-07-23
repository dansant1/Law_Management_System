MiCalendario = new Mongo.Collection( 'micalendario' );

MiCalendario.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

MiCalendario.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let MiCalendarioSchema = new SimpleSchema({
  'title': {
    type: String,
    label: '¿De que trata el evento?'
  },
  'start': {
    type: Date,
    label: '¿Cuando empieza el evento?'
  },
  'end': {
    type: Date,
    label: '¿Cuando finaliza el evento?'
  },
  'type': {
    type: String,
    label: '¿Que tipo de evento es?',
    optional: true
  },
  bufeteId: {
    type: String
  },
  userId: {
    type: String
  },
  'asunto': {
    type: Object
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
  'hora': {
    type: Object,
    optional: true
  },
  'hora.nombre': {
    type: String,
  },
  'hora.id': {
    type: String
  },
  'tarea': {
    type: Object,
    optional: true
  },
  'tarea.nombre': {
    type: String
  },
  'tarea.id': {
    type: String
  }
});

MiCalendario.attachSchema( MiCalendarioSchema );
