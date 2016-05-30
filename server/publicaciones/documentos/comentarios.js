Meteor.publish('comentarios', function (datos) {
  check(datos, {
    bufeteId: String,
    archivoId: String
  });

  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return ComentariosDeArchivo.find({bufeteId: datos.bufeteId, archivoId: datos.archivoId});
  } else {
    this.stop();
    return;
  }
});
