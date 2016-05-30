Meteor.methods({
  'agregarComentario': function (datos) {
    check(datos, {
      comentario: String,
      bufeteId: String,
      archivoId: String,
      creador: Object
    });

    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

      datos.createdAt = new Date();

      ComentariosDeArchivo.insert(datos);

    } else {
      return;
    }
  },
  'agregarDocNews': function (datos) {
      check(datos, {
        nombre: String,
        asunto: Object,
        creador: Object,
        bufeteId: String
      });

      NewsFeed.insert({
          descripcion: 'agregó el archivo ' + datos.nombre + ' en el asunto ' + datos.asunto.nombre,
          tipo: 'Documentos',
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
});
