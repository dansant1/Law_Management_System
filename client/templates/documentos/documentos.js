Template.documentos.onCreated(function () {
  var self = this;

	self.autorun(function() {

		  let asuntoId = FlowRouter.getParam('asuntoId');

    	self.subscribe('docsAsunto', asuntoId);

   });

});


Template.documentos.helpers({
    docs: () => {
        let result = Documentos.find({});
        return result;
    },
    /*carpetas: () => {
      return Carpetas.find({});
    }*/
    sucedio(createdAt) {

    var d =  createdAt,
        dformat = [ d.getDate().padLeft(),
              (d.getMonth()+1).padLeft(),
                    d.getFullYear()].join('/')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft()].join(':');

      return dformat;
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
                nombre: $( ".asunto option:selected" ).text(),
                id: $( ".asunto option:selected" ).val()
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

Template.archivoModal.events({
  'submit form': function (event, template) {
      event.preventDefault();
      subirArchivo(event, template);
  }
});

Template.subarchivoModal.events({
  'submit form': function (event, template) {
      event.preventDefault();
      subirsubArchivo(event, template);
  }
});


Template.carpetas.events({
  'change .archivos': function (event, template) {
    FS.Utility.eachFile(event, function (file) {
      var archivo = new FS.File(file);
      archivo.metadata = {
        creadorId: Meteor.userId(),
        bufeteId: Meteor.user().profile.bufeteId,
        carpetaId: FlowRouter.getParam("carpetaId"),
        subdoc: true
      }
      //console.log(file);
      Documentos.insert(archivo, function (err, fileObj) {
        if (err) {
          console.log(err);
        } else {
          Bert.alert('Agregaste un nuevo archivo', 'success');
        }
      });
    });
  }
});


Template.documentos.helpers({
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	},
  asuntoId() {
    return FlowRouter.getParam('asuntoId');
  }
});

Template.carpetas.helpers({
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	}
});



Template.nuevaCarpeta.events({
  'click a': () => {
    Modal.show('carpetaModal');
  }
});

Template.nuevasubCarpeta.events({
  'click a': () => {
    Modal.show('subcarpetaModal');
  }
});

Template.carpetaModal.onCreated(function () {
  var self = this;

	self.autorun(function() {

		  let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntos', bufeteId);
   });

});

Template.carpetaModal.helpers({
  asuntos: function () {
    return Asuntos.find({});
  }
});

Template.archivoModal.onCreated(function () {
  var self = this;

	self.autorun(function() {

		  let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntos', bufeteId);
   });

});

Template.archivoModal.helpers({
  asuntos: function () {
    return Asuntos.find({});
  }
});





Template.carpetaModal.events({
  'submit form': function (event, template) {
    event.preventDefault();
    let datos = {
      nombre: template.find('[name="nombre"]').value,
      descripcion: template.find('[name="descripcion"]').value,
      bufeteId: Meteor.user().profile.bufeteId,
      asunto: {
				nombre: $( ".asunto option:selected" ).text(),
				id: $( ".asunto" ).val()
			}
    }

    datos.creador = {
      nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
      id: Meteor.userId()
    }

    if (datos.nombre !== "") {
      Meteor.call('agregarCarpeta', datos, function (err, result) {
        if (err) {
          Bert.alert('Hubo un problema, intentalo de nuevo', 'warning');
        } else {
          template.find('[name="nombre"]').value = "";
          template.find('[name="descripcion"]').value = "";
          $('#carpeta-modal').modal('hide');
          Bert.alert('Agregaste una carpeta', 'success');
        }
      });
    } else {
      Bert.alert('Agrega el nombre de la carpeta', 'warning');
    }
  }
});

Template.subcarpetaModal.events({
  'submit form': function (event, template) {
    event.preventDefault();
    let datos = {
      nombre: template.find('[name="nombre"]').value,
      descripcion: template.find('[name="descripcion"]').value,
      bufeteId: Meteor.user().profile.bufeteId
    }

    datos.padreId = FlowRouter.getParam("carpetaId");

    datos.creador = {
      nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
      id: Meteor.userId()
    }

    console.log(datos.padreId);

    if (datos.nombre !== "") {
      Meteor.call('agregarsubCarpeta', datos, function (err, result) {
        if (err) {
          Bert.alert('Hubo un problema, intentalo de nuevo', 'warning');
        } else {
          template.find('[name="nombre"]').value = "";
          template.find('[name="descripcion"]').value;
          $('#carpeta-modal').modal('hide');
          Bert.alert('Agregaste una carpeta', 'success');
        }
      });
    } else {
      Bert.alert('Agrega el nombre de la carpeta', 'warning');
    }
  }
});

Template.carpetas.onCreated(function () {
  var self = this;

	self.autorun(function() {

		  let bufeteId = Meteor.user().profile.bufeteId;
      let carpetaId = FlowRouter.getParam("carpetaId");

    	self.subscribe('subdocs', bufeteId, carpetaId);
      self.subscribe('subcarpetas', bufeteId, carpetaId);
   });

});

Template.carpetas.helpers({
    docs: () => {
        let result = Documentos.find({});
        return result;
    },
    carpetas: () => {
      return Carpetas.find({});
    }

});

Template.nuevosubArchivo.events({
  'click a': () => {
    Modal.show('subarchivoModal');
  }
});

Template.nuevoArchivo.events({
  'click a': () => {
    Modal.show('archivoModal');
  }
});
