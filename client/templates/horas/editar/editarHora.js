Template.editarHoraModal.onCreated(function () {
    console.log(this._id);
});


Template.editarHoraModal.onRendered(function () {
    let template = this;
    let hora = Horas.findOne({_id:Session.get('hora-id')})
    debugger;

    var picker = new Pikaday({ field: document.getElementById('datepicker') });
    if(hora.asunto) Session.set('asunto-select-id',hora.asunto.id)

    $(template.find("#tarea-select")).prop("checked",hora.esTarea);
    if(hora.esTarea) $(template.find(".buscar-tarea")).removeClass("hide")
    if(hora.descripcion!=undefined) template.find("[name='descripcion']").value=hora.descripcion;
    template.find("[name='fecha']").value= formatearFecha(hora.fecha);
    template.find("[name='horas']").value= hora.horas;
    if(hora.asunto) $(template.find("[name='asunto'] option[value='"+ hora.asunto.id +"']")).prop('select',true);
    $(template.find("[name='responsable'] option[value='"+ hora.responsable.id +"']")).prop('selected',true);
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
			nombre: $(template.find( ".responsable option:selected" )).text(),
			id: $(template.find( ".responsable" )).val()
		}

		if (datos.horas !== "" && datos.asunto !== undefined && datos.fecha !== "") {

			Meteor.call('actualizarHora',Session.get('hora-id'), datos, function (err, result) {
				if (err) return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');

				if(Session.get("cronometro-pausado")) chronometer.reset();
				$('#agregar-modal').modal('hide');
				Bert.alert('Editastes horas', 'success');
			});

		} else {
			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
		}
    },
    'change #tarea-select'(event,template){
		if($(event.target).is(":checked")){
			$(template.find(".descripcion-tarea")).addClass('hide');
			$(template.find(".buscar-tarea")).removeClass('hide')
		}else {
			$(template.find(".descripcion-tarea")).removeClass('hide');
			$(template.find(".buscar-tarea")).addClass('hide')
		}

	},
    'change [name="asunto"]'(event,template){
		Session.set('asunto-select-id',event.target.value);
	}
})

Template.editarHoraModal.helpers({
    asunto(){
        return Asuntos.find();
    },
    responsable(){
        return Asuntos.findOne({_id:Session.get('asunto-select-id')}).abogados;
    }
})
