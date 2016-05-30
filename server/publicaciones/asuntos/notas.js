Meteor.publish('notas', function (datos) {
  check(datos, {
    bufeteId: String,
    asuntoId: String
  });

  if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Notas.find({bufeteId: datos.bufeteId, asuntoId: datos.asuntoId});
  } else {
    this.stop();
    return;
  }
});
