Template.asuntos.onCreated(function () {

	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntos', bufeteId);
   });

});

Template.asuntos.helpers({
	asuntos: function () {
		return Asuntos.find();
	}
});

Template.asuntoNuevo.helpers({
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.nuevoEstado.helpers({
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.nuevoEstado.events({
	'click .__open': function () {
		Modal.show('estadoForm');
	}
});

Template.estadoForm.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.estadoForm.events({
	'submit form': function (event, template) {
		event.preventDefault();

		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			creadorId: Meteor.userId(),
			fecha: template.find( '[name="fecha"]' ).value
		};

		if (datos.nombre !== "" && datos.descripcion !== "") {
			datos.bufeteId = Meteor.user().profile.bufeteId;
			datos.asuntoId = FlowRouter.getParam('asuntoId');

			Meteor.call('crearEstado', datos, function (err, result) {
				if (err) {
					Bert.alert('Algo salío mal', 'warning');
				} else {
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
					template.find( '[name="fecha"]' ).value = "";
					$('#estado-modal').modal('hide');
					Bert.alert('Agregaste un estado', 'success');
				}
			});

		} else {
			Bert.alert('Completa los datos', 'warning');
		}
	}
});
