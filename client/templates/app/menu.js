Template.menu.events({
	'click .logout': () => {
		Meteor.logout();
	},

	'click .agregar-tarea': () =>{

	},
	'click .agregar-nota': () =>{
		Modal.show('notaxasuntosModal')
	},
	'click .agregar-evento': () =>{
		Modal.show('evento');
	},
	'click .agregar-cliente': () =>{
		Modal.show('clienteNuevoModal');
	}
});

Template.notaxasuntosModal.helpers({
	asuntos (){
		return Asuntos.find({});
	}
});

Template.notaxasuntosModal.onRendered(function(){
	var picker = new Pikaday({ field: document.getElementById('datepicker3') });

})

Template.notaxasuntosModal.events({
	'submit form' : function (event,template) {

		event.preventDefault();
		debugger;
		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			creadorId: Meteor.userId(),
			bufeteId: Meteor.user().profile.bufeteId,
			asuntoId: template.find('[name="asuntoId"]').value,
			fecha: template.find('[name="fecha"]').value
		}

		if (datos.nombre !== "") {
			Meteor.call('agregarNota', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					//Bert.alert('Agregaste una nueva nota', 'success');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
					template.find('[name="fecha"]').value = "";
					$('#nota-modal').modal('hide');
					swal("Agregaste una nueva nota");
				}
			});
		} else {
			Bert.alert('Agrega los datos correctamente', 'warning');
		}
	}
})

Template.menu.helpers({
	nombre: function () {
		return Meteor.users.findOne({});
	}
});
