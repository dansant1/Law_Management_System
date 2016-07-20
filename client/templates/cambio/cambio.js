Template.agregarTipoCambio.events({
    'submit form'(event,template){
        event.preventDefault();

        let data = {
            cambio:Number(template.find("[name='cambio']").value),
            bufeteId : Meteor.user().profile.bufeteId
        }

        if (data.cambio !== "") {
            Meteor.call('insertarCambio',data,function (err) {
            if(err) {
                return Bert.alert('No se añadio correctamente, intentelo nuevamente','danger');
                template.find("[name='cambio']").value = "";
                Modal.hide('agregarTipoCambio');   
            } else {
                Bert.alert('Se añadio correctamente el cambio','success');
                template.find("[name='cambio']").value = "";
                Modal.hide('agregarTipoCambio');
            }
            
        })
        } else {
            Bert.alert('Agregue el valor correctamente','warning');
        }

        
    }
})


