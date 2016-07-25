Template.editarTareaModal.events({
    'click .editar-tareas'(events,template){
        events.preventDefault();
        events.stopPropagation();
        //debugger;
        let datos = {
            descripcion: template.find('[name="descripcion"]').value,
            fecha: template.find('[name="fecha"]').value,
            asunto: {
                nombre: $(template.find( ".asunto option:selected" )).text(),
                id: $(template.find( ".asunto" )).val()
            },
            tipo: $(template.find(".tipo")).val(),
            bufeteId: Meteor.user().profile.bufeteId,
            asignado:{
                id: Meteor.userId(),
                nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
            },
            creador: {
                nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
                id: Meteor.userId()
            },
            etapa:{
                id: template.find("[name='etapa']").value,
                nombre: Etapas.findOne({_id:template.find("[name='etapa']").value}).nombre
            }
        }

        console.log(datos.fecha);

        if (datos.asunto.nombre === "Elige un asunto" && datos.asunto.id === "") {
            datos.asunto.nombre = undefined;
            datos.asunto.id = undefined;
        }

        if (datos.descripcion !== "" && datos.fecha !== "") {
            Meteor.call('editarTareas', datos, Session.get('tarea-id'), function (err, result) {
                if (err) return	Bert.alert('Error al tratar de registrar, intentelo de nuevo', 'danger');

                template.find('[name="descripcion"]').value = "";
                template.find('[name="fecha"]').value = "";
                Bert.alert('Editaste una tarea', 'success');
                FlowRouter.go('/tareas');
            });

        } else {
            Bert.alert('Ingresa los datos', 'warning');
        }
    },
    'change .asunto'(event,template){
        Session.set("asunto-id",$(event.target).val())
    }
})

Template.editarTareaModal.onRendered(function () {
    let template = this;
    let tarea = Tareas.findOne({_id:Session.get('tarea-id')})
    if(tarea.asunto) Session.set('asunto-select-id',tarea.asunto.id)
    debugger;
    var picker = new Pikaday({ field: document.getElementById('datepicker') });

    if(tarea.descripcion!=undefined) template.find("[name='descripcion']").value=tarea.descripcion;
    template.find("[name='fecha']").value= formatearFecha(tarea.vence);
    if(tarea.asunto) $(template.find("[name='asunto'] option[value='"+ tarea.asunto.id +"']")).prop('selected',true);
    if(tarea.etapa) $(template.find("[name='etapa'] option[value='"+ tarea.etapa.id +"']")).prop('selected',true);
})

Template.editarTareaModal.onCreated(function () {
    var self = this;

	self.autorun(function() {
		let id = Meteor.user()._id;

		let bufeteId = Meteor.user().profile.bufeteId;

		self.subscribe('asuntosxequipo',id, bufeteId);
		self.subscribe('etapas',bufeteId)
	});
})

Template.editarTareaModal.helpers({
    asuntos: function () {
		return Asuntos.find({abierto:true,abogados:{$elemMatch:{id:Meteor.userId()}}});
	},
    etapas:function () {
		return Etapas.find({'asunto.id':Session.get('asunto-select-id')});
	}
})
