Meteor.publish('recibos', function (bufeteId) {
  check(bufeteId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
        return Recibos.find({
          "metadata.bufeteId": bufeteId
        });
  } else {
    this.stop();
    return;
  }
});
