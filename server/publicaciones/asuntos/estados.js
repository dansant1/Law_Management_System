Meteor.publish('estados', function (bufeteId, asuntoId) {
    check(bufeteId, String);
    check(asuntoId, String);

    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
      return Estados.find({bufeteId: bufeteId, asuntoId: asuntoId});
    } else {
      this.stop();
      return;
    }
});
