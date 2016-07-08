Meteor.publish('facturas',function (bufeteId) {
    check(bufeteId,String)

    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
      return Facturas.find({bufeteId:bufeteId});
    } else {
      this.stop();
      return;
    }
})
