Meteor.methods({
  enviarMensaje: function (datos) {
    check(datos, {
      mensaje: String,
      bufeteId: String,
      asuntoId: String,
      creador: Object
    });

    if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

      datos.createdAt = new Date();
      MensajesAsunto.insert(datos);

    } else {
      return;
    }
  }
});
