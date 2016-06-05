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
    type: String,
    label: '¿Cuando empieza el evento?'
  },
  'end': {
    type: String,
    label: '¿Cuando finaliza el evento?'
  },
  'type': {
    type: String,
    label: '¿Que tipo de evento es?',
    optional: true
    //allowedValues: [ 'Birthday', 'Corporate', 'Wedding', 'Miscellaneous' ]
  },
  bufeteId: {
    type: String
  },
  userId: {
    type: String
  }
});

MiCalendario.attachSchema( MiCalendarioSchema );