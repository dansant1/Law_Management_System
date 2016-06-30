Template.editarHoraModal.onCreated(function () {
    console.log(this._id);
});



Template.editarHoraModal.onRendered(function () {
    let horaId = this._id;
    let template = this;
    let hora = Horas.findOne({_id:Session.get('hora-id')})
    debugger;

    template.find("[name='descripcion']").value=hora.descripcion;
    template.find("[name='fecha']").value= formatearFecha(hora.fecha);
    template.find("[name='horas']").value= hora.horas;
    $(template.find("[name='responsable'] option[value='"+ hora.responsable.id +"']")).prop('selected',true);
    $(template.find("[name='asunto'] option[value='"+ hora.asunto.id +"']")).prop('select',true);
    template.find("[name='minutos']").value=hora.minutos;

})

Template.editarHoraModal.events({
    'submit form'(event,template){
        event.preventDefault();
		debugger;
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			horas: template.find('[name="horas"]').value,
			minutos: template.find('[name="minutos"]').value,
			// precio: template.find('[name="precio"]').value,
			cobrado: $(".cobrado").is(":checked"),
			esTarea: $(".es-tarea").is(":checked"),
			creador: {
				id: Meteor.user()._id,
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
			}
		}

		if($(".es-tarea").is(":checked")) datos.tarea = {
			id: Session.get('tarea-hora').id,
			nombre: Session.get('tarea-hora').value
		}



		datos.asunto = {
			nombre: template.find( ".asunto option:selected" ).innerHTML,
			id: template.find(".asunto").value
		}

		datos.responsable = {
			nombre: $( ".responsable option:selected" ).text(),
			id: $( ".responsable" ).val()
		}

		if (datos.horas !== "" && datos.asunto !== undefined && datos.fecha !== "") {

			Meteor.call('actualizarHora',Session.get('hora-id'), datos, function (err, result) {
				if (err) return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');

				if(Session.get("cronometro-pausado")) chronometer.reset();
				$('#agregar-modal').modal('hide');
				Bert.alert('Agregaste horas', 'success');
			});

		} else {
			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
		}
    }
})

Template.editarHoraModal.helpers({
    asunto(){
        return Asuntos.find();
    },
    responsable(){
        return Meteor.users.find();
    }
})
