Meteor.methods({
  'agregarCarpeta': function (datos) {
    check(datos, {
      nombre: String,
      descripcion: String,
      creador: Object,
      bufeteId: String,
      asunto: Object
    });

    if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

      datos.createdAt = new Date();
      datos.subcarpeta = false;
      let carpetaId = Carpetas.insert(datos);

    } else {
      return;
    }
  },
  'agregarsubCarpeta': function (datos) {
    check(datos, {
      nombre: String,
      descripcion: String,
      creador: Object,
      bufeteId: String,
      padreId: String
    });

    if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

      datos.createdAt = new Date();
      datos.subcarpeta = true;
      let carpetaId = Carpetas.insert(datos);

    } else {
      return;
    }
  }
});
