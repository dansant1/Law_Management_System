Template.agregarTipoCambio.events({
    'submit form'(event,template){
        event.preventDefault();

        let data = {
            cambio:Number(template.find("[name='cambio']").value),
            bufeteId : Meteor.user().profile.bufeteId
        }

        Meteor.call('insertarCambio',data,function (err) {
            if(err) {
                return Bert.alert('No se añadio correctamente, intentelo nuevamente','danger');
                template.find("[name='cambio']").value = "";   
            } else {
                Bert.alert('Se añadio correctamente el cambio','success');
                template.find("[name='cambio']").value = "";
            }
            
        })
    }
})

// Template.agregarTipoCambio.
