Meteor.publish('archivoUnico', function (archivoId) {
    check(archivoId, String);
    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
        return Documentos.find({_id: archivoId});
    } else {
      this.stop();
      return;
    }

});

Meteor.publish('archivosDeTareas', function (tareaId) {
    check(tareaId, String);
    if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
        return DocumentosTareas.find({"metadata.tareaId": tareaId});
    } else {
      this.stop();
      return;
    }

});
