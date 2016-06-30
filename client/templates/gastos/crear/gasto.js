Template.agregarGasto.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.agregarGasto.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
		// self.subscribe('asuntosx', bufeteId);
   });
});

Template.agregarGasto.helpers({
	asunto: () => {
		return Asuntos.find({});
	},
	responsable: () => {
		return Meteor.users.find({});
	}
});


Template.agregarGasto.events({
	'submit form': function (event, template) {
		event.preventDefault();

		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			monto: template.find('[name="precio"]').value
		}

		datos.asunto = {
			nombre: $( ".asunto option:selected" ).text(),
			id: $( ".asunto" ).val()
		}

		datos.responsable = {
			nombre: $( ".responsable option:selected" ).text(),
			id: $( ".responsable" ).val()
		}

		if (datos.monto !== "" && datos.asunto !== undefined && datos.fecha !== "" && datos.descripcion !== "") {

			Meteor.call('agregarGasto', datos, function (err, result) {
				if (err) {
					Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
				} else {
					$('#gasto-modal').modal('hide');
					Bert.alert('Agregaste un gasto', 'success');
				}
			});

		} else {
			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
		}
	}
});
