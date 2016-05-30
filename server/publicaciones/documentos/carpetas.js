Meteor.publish('datosCarpeta', function (carpetaId) {
  check(carpetaId, String);

  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Carpetas.find({_id: carpetaId});
  } else {
    this.stop();
    return;
  }
});
