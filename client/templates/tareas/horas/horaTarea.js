Template.horaTareaModal.events({
    'submit form'(event,template){
        event.preventDefault();
        let datos = {
            id: this._id,
            horas: template.find("[name='horas']").value,
            minutos: template.find("[name='minutos']").value
        }
        Meteor.call('agregarHoraTarea',datos,function (err) {
            if(err) return Bert.alert('No se pudo modificar las horas correctamente','danger')
            Bert.alert('Se añadio las horas correctamente','success');
            Modal.hide('horaTareaModal')
        })
    }
})
