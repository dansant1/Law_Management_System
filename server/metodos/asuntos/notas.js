Meteor.methods({
  'agregarNota': function (datos) {
    check(datos, {
      nombre: String,
      descripcion: String,
      bufeteId: String,
      creadorId: String,
      asuntoId: String,
      fecha: String
    });

    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

      datos.createdAt = new Date();
      let creador = Meteor.users.findOne({_id: datos.creadorId}).profile;
      datos.autor = creador.nombre + ' ' + creador.apellido;
      let fecha = datos.fecha;
      datos.fecha = new Date(datos.fecha);
      console.log(datos.fecha)
      let notaId = Notas.insert(datos);

      if (notaId) {

        let asunto = Asuntos.findOne({_id: datos.asuntoId});
        let creador = Meteor.users.findOne({_id: datos.creadorId}).profile;

        // Creamos el evento de inicio de estado  (asunto)
				let evento = {
					title: creador.nombre + " " + creador.apellido + " agregó la nota " + datos.nombre + " - " + " en el asunto " + asunto.caratula ,
					start: fecha,
					end: fecha,
					asunto: {
						nombre: asunto.caratula,
						id: datos.asuntoId
					},
					bufeteId: datos.bufeteId,
					creador: {
						nombre: creador.nombre + " " + creador.apellido,
						id: datos.creadorId
					},
					createdAt: new Date(),
					color: '##9B59B6'
				};

				Eventos.insert(evento);

        NewsFeed.insert({
          descripcion: 'agrego la nota ' + datos.nombre + ' en el asunto ' + asunto.caratula,
          tipo: 'Nota',
          creador: {
            nombre: creador.nombre + ' ' + creador.apellido,
            id: datos.creadorId
          },
          asunto: {
            nombre: asunto.caratula,
            id: datos.asuntoId
          },
          bufeteId: datos.bufeteId,
          createdAt: new Date()
        });
      }

    } else {
      return;
    }
  }
});
