Template.contacto.events({
	'submit form': function (e, t) {
		let datos = {
			nombre: t.find('[name="nombre"]').value,
			apellido: t.find('[name="apellido"]').value,
			email: t.find('[name="email"]').value,
			telefono: t.find('[name="telefono"]').value,
			firma: t.find('[name="firma"]').value,
			mensaje: t.find('[name="mensaje"]').value
		}

		datos.pais = $( "#pais" ).val();

		if (datos.nombre !== "" && datos.apellido !== "" && datos.email !== "" && datos.telefono !== "" && datos.firma !== "" && datos.mensaje !== "" && datos.pais !== "indefinido") {
			Meteor.call('contactanos', datos, function (err) {
				if (err) {
					Bert.alert('Hubo un error. Vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Gracias, pronto nos estaremos contactando contigo.', 'success');
					FlowRouter.go('/');
				}
			});
		} else {
			Bert.alert('Complete los datos por favor. Intentelo nuevamente', 'warning');
		}
	}
});

Template.formularioDemo.events({
	'submit form': function (e, t) {
		let datos = {
			nombre: t.find('[name="nombre"]').value,
			apellido: t.find('[name="apellido"]').value,
			email: t.find('[name="email"]').value,
			telefono: t.find('[name="telefono"]').value,
			firma: t.find('[name="firma"]').value,
			mensaje: t.find('[name="mensaje"]').value
		}

		datos.pais = $( "#pais" ).val();

		if (datos.nombre !== "" && datos.apellido !== "" && datos.email !== "" && datos.telefono !== "" && datos.firma !== "" && datos.mensaje !== "" && datos.pais !== "indefinido") {
			Meteor.call('solicitarDemo', datos, function (err) {
				if (err) {
					Bert.alert('Hubo un error. Vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Gracias, nos estaremos comunicando contigo dentro de las proximas 24 horas.', 'success');
					FlowRouter.go('/');
				}
			});
		} else {
			Bert.alert('Complete los datos por favor. Intentelo nuevamente', 'warning');
		}
	
	}
});