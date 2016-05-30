Template.notas.events({
  'click a.btn.nota': (event, template) => {
    Modal.show('notaModal');
  }
});

Template.notas.onCreated(function () {
  var self = this;

  self.autorun(function() {

		  let datos = {
        bufeteId: Meteor.user().profile.bufeteId,
        asuntoId: FlowRouter.getParam('asuntoId')
      };

    	self.subscribe('notas', datos);
   });

});

Template.notas.helpers({
  notas() {
    let result = Notas.find({}, { sort: {fecha: -1} });
    return result;
  },
  dia(fecha) {
		var d = fecha,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		  return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	}
});

Template.notaModal.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.notaModal.events({
  'submit form': (event, template) => {
    event.preventDefault();

    let datos = {
      nombre: template.find('[name="nombre"]').value,
      descripcion: template.find('[name="descripcion"]').value,
      creadorId: Meteor.userId(),
      bufeteId: Meteor.user().profile.bufeteId,
      asuntoId: FlowRouter.getParam('asuntoId'),
      fecha: template.find( '[name="fecha"]' ).value
    }

    if (datos.nombre !== "") {
      Meteor.call('agregarNota', datos, function (err, result) {
        if (err) {
          Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        } else {
          //Bert.alert('Agregaste una nueva nota', 'success');
          template.find('[name="nombre"]').value = "";
          template.find('[name="descripcion"]').value = "";
          template.find( '[name="fecha"]' ).value = "";
          $('#nota-modal').modal('hide');
          swal("Agregaste una nueva nota");
        }
      });
    } else {
      Bert.alert('Agrega los datos correctamente', 'warning');
    }

  }
});
