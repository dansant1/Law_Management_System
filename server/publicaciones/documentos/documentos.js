Meteor.publish('docs', function (bufeteId) {
  check(bufeteId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
        return Documentos.find({
          "metadata.bufeteId": bufeteId,
          "metadata.subdoc": false
        });
  } else {
    this.stop();
    return;
  }
});



Meteor.publish('docsGastos', function (bufeteId) {
  check(bufeteId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
        return Documentos.find({
          "metadata.bufeteId": bufeteId
        });
  } else {
    this.stop();
    return;
  }
});


Meteor.publish('docsVersion',function (docId) {
    check(docId, String);
    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
      return Documentos.find({
        'metadata.version':{
            $exists:true
        },
        'metadata.version':docId
      });
    } else {
      this.stop();
      return;
    }

})

Meteor.publish('docsAsunto', function (asuntoId) {
  check(asuntoId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Documentos.find({
      "metadata.asunto.id": asuntoId,
      "metadata.subdoc": false
    });
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('subdocs', function (bufeteId, carpetaId) {
  check(bufeteId, String);
  check(carpetaId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Documentos.find({
      "metadata.bufeteId": bufeteId,
      "metadata.carpetaId": carpetaId,
      "metadata.subdoc": true
    });
  } else {
    this.stop();
    return;
  }
});


Meteor.publish('carpetas', function (bufeteId) {
  check(bufeteId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Carpetas.find({
      bufeteId: bufeteId,
      subcarpeta: false
    });
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('carpetasAsunto', function (asuntoId) {
  check(asuntoId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Carpetas.find({
      'asunto.id': asuntoId,
      subcarpeta: false
    });
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('subcarpetas', function (bufeteId, carpetaId) {
  check(bufeteId, String);
  check(carpetaId, String);
  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Carpetas.find({
      bufeteId: bufeteId,
      padreId: carpetaId,
      subcarpeta: true
    });
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('subcarpetasAsunto', function (carpetaId) {

  check(carpetaId, String);

  if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
    return Carpetas.find({
      padreId: carpetaId,
      subcarpeta: true
    });
  } else {
    this.stop();
    return;
  }
});
