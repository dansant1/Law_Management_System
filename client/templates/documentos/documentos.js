Template.documentos.helpers({
  email() {
    return Meteor.user().emails[0].address
  }
});

function subirArchivo (event, template) {
    let datos = {
      nombre: template.find('[name="nombre"]').value,
      descripcion: template.find('[name="descripcion"]').value
    }

    let archivo = document.getElementById("myArchivo");

    if ('files' in archivo) {

        if (archivo.files.length == 0) {
            Bert.alert('Selecciona un archivo, vuelve a intentarlo', 'warning');
        } else if (archivo.files.length > 1) {
           Bert.alert('Selecciona solo un archivo, vuelve a intentarlo', 'warning');
         } else {


          for (var i = 0; i < archivo.files.length; i++) {

            var filei = archivo.files[i];

            var doc = new FS.File(filei);

            doc.metadata = {
              creadorId: Meteor.userId(),
              bufeteId: Meteor.user().profile.bufeteId,
              subdoc: false,
              descripcion: datos.descripcion,
              nombre: datos.nombre,
              asunto: {
                nombre: Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].caratula,
                id: FlowRouter.getParam('asuntoId')
              }
            };

            Documentos.insert(doc, function (err, fileObj) {
              if (err) {
                Bert.alert('Hubo un problema', 'warning');
              } else {
                let data = {
                  nombre: datos.nombre,
                  asunto: {
                    nombre: doc.metadata.asunto.nombre,
                    id: doc.metadata.asunto.id
                  },
                  creador: {
                    nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
                    id: Meteor.userId()
                  },
                  bufeteId: Meteor.user().profile.bufeteId

                }
                Meteor.call('agregarDocNews', data, function (err) {
                  if (err) {
                    Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
                  } else {
                    template.find('[name="nombre"]').value = "";
                    template.find('[name="descripcion"]').value = "";
                    $('#doc-modal').modal('hide');
                    Bert.alert('Subiste el archivo', 'success');
                  }

                });

              }
            });
          }
        }
    }
} // Fin de la funcion subirArchivo

function subirsubArchivo (event, template) {
    let datos = {
      nombre: template.find('[name="nombre"]').value,
      descripcion: template.find('[name="descripcion"]').value
    }

    let archivo = document.getElementById("myArchivo");

    if ('files' in archivo) {

        if (archivo.files.length == 0) {
            Bert.alert('Selecciona un archivo, vuelve a intentarlo', 'warning');
        } else if (archivo.files.length > 1) {
           Bert.alert('Selecciona solo un archivo, vuelve a intentarlo', 'warning');
         } else {


          for (var i = 0; i < archivo.files.length; i++) {

            var filei = archivo.files[i];

            var doc = new FS.File(filei);

            doc.metadata = {
              creadorId: Meteor.userId(),
              bufeteId: Meteor.user().profile.bufeteId,
              subdoc: true,
              descripcion: datos.descripcion,
              nombre: datos.nombre,
              carpetaId: FlowRouter.getParam('carpetaId')
            };

            Documentos.insert(doc, function (err, fileObj) {
              if (err) {
                Bert.alert('Hubo un problema', 'warning');
              } else {
                template.find('[name="nombre"]').value = "";
                template.find('[name="descripcion"]').value = "";
                $('#doc-modal').modal('hide');
                Bert.alert('Subiste el archivo', 'success');
              }
            });
          }
        }
    }
} // Fin de la funcion subirArchivo

