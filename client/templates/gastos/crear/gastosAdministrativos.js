Template.agregarGastoAdministrativo.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker3') });
});

Template.agregarGastoAdministrativo.events({
	'submit form': function (event,template) {
		event.preventDefault();

		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			monto: template.find('[name="precio"]').value
		}

		if (datos.monto !== "" && datos.fecha !== "" && datos.descripcion !== "") {

			Meteor.call('agregarGastoAdministrativo', datos, function (err, result) {
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
})
