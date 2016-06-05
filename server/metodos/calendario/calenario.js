Meteor.methods({
	crearEvento: function (datos) {
		check(datos, {
			title: String,
			start: String,
			end: String,
			asunto: Object,
			bufeteId: String,
			creador: Object,

		});

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			
			datos.createdAt = new Date();
			datos.color = '#2ECC71';
			//console.log(datos);
			Eventos.insert(datos);
			NewsFeed.insert({
					descripcion: 'creó el evento ' + datos.title,
					tipo: 'Evento',
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					asunto: {
						nombre: datos.asunto.nombre,
						id: datos.asunto.id
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});
		}
	}
});


Meteor.methods({
  addEvent( event ) {
    check( event, {
      title: String,
      start: String,
      end: String,
      type: String,
      bufeteId: String
    });

    event.userId = this.userId;

    try {
      return MiCalendario.insert( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});

Meteor.methods({
  editEvent( event ) {
    check( event, {
      _id: String,
      title: Match.Optional( String ),
      start: String,
      end: String,
      type: Match.Optional( String ),
      bufeteId: String
    });

    try {
      return MiCalendario.update( event._id, {
        $set: event
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});

Meteor.methods({
  removeEvent( event ) {
    check( event, String );

    try {
      return MiCalendario.remove( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});