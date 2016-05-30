Template.detalleArchivo.events({
  'click .__enviar': function (event, template) {
    event.preventDefault();

    let datos = {
      comentario: template.find('[name="comentario"]').value,
      bufeteId: Meteor.user().profile.bufeteId,
      creador: {
        nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
        id: Meteor.userId()
      },
      archivoId: FlowRouter.getParam('documentoId')
    }

    if (datos.comentario !== "") {
      Meteor.call('agregarComentario', datos, function (err, result) {
        if (err) {
          Bert.alert('Hubo un problema, vuelve a intentarlo', 'warning');
        } else {
          template.find('[name="comentario"]').value = "";
        }
      });
    } else {
      Bert.alert('Ingresa un comentario', 'warning');
    }
  }
});


Template.cajaComentario.events({
  'click .__enviar': function (event, template) {
    event.preventDefault();

    let datos = {
      comentario: template.find('[name="comentario"]').value,
      bufeteId: Meteor.user().profile.bufeteId,
      creador: {
        nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
        id: Meteor.userId()
      },
      archivoId: FlowRouter.getParam('documentoId')
    }

    if (datos.comentario !== "") {
      Meteor.call('agregarComentario', datos, function (err, result) {
        if (err) {
          Bert.alert('Hubo un problema, vuelve a intentarlo', 'warning');
        } else {
          template.find('[name="comentario"]').value = "";
        }
      });
    } else {
      Bert.alert('Ingresa un comentario', 'warning');
    }
  }
});

Template.comentarios.onCreated(function () {
  var self = this;

  self.autorun(function() {
      let datos = {
          bufeteId: Meteor.user().profile.bufeteId,
          archivoId: FlowRouter.getParam('documentoId')
      }


    	self.subscribe('comentarios', datos);
   });

});

Template.comentarios.helpers({
  comentarios: () => {
    let result = ComentariosDeArchivo.find({});
    return result;
  }
});

Template.datosArchivo.onCreated(function () {
  var self = this;

  self.autorun(function () {
    let archivoId = FlowRouter.getParam('archivoId');
    self.subscribe('archivoUnico', archivoId);
  });
});

Template.datosArchivo.helpers({
  archivo() {
    return Documentos.findOne({});
  },
  dia(fecha) {
    var d = fecha,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
  },
  esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.datosArchivo.events({
  'click .eliminar': () => {
    swal({  title: "¿Seguro que quieres eliminar este archivo?",
				text: "Este archivo ni sus versiones estaran disponibles",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, eliminar archivo",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: false
			},
			function() {
				/*let archivoId = FlowRouter.getParam('archivoId');
				Documentos.remove({_id: archivoId});
				}); */
				swal("Archivo eliminado", "El archivo ha sido eliminado correctamente.", "success");
			});
  }
});

Template.comentarios.helpers({
  sucedio(createdAt) {

		var d =  createdAt,
        dformat = [	d.getDate().padLeft(),
        			(d.getMonth()+1).padLeft(),
                    d.getFullYear()].join('/')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft()].join(':');

    	return dformat;
	}
});
