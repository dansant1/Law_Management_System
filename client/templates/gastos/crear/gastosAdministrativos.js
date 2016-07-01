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

			return Meteor.call('agregarGastoAdministrativo', datos, function (err, result) {
				if (err) return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
				debugger;
				let archivo = template.find('[name="recibo"]');

				if ('files' in archivo) {
		          for (var i = 0; i < archivo.files.length; i++) {
					  var filei = archivo.files[i];

			            var doc = new FS.File(filei);

			            doc.metadata = {
			              	creadorId: Meteor.userId(),
			              	bufeteId: Meteor.user().profile.bufeteId,
			              	descripcion: datos.descripcion,
							gastoId: result.gastoId,
			            };

			            Recibos.insert(doc, function (err, fileObj) {
			              if (err) return Bert.alert('Hubo un problema', 'warning');
						})
					}
			    }

				Modal.hide('agregarGastoAdministrativo')
				Bert.alert('Agregaste un gasto', 'success');
			});

		}

		Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');

	}
})
