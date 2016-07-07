Template.editarEmpresaContacto.events({
    'click [name="mycheckbox"]'(event,template){
        if(event.target.value=="crear"){
            $(template.find(".crear-empresa-form")).removeClass("hide")
            $(template.find(".buscador-empresa")).addClass("hide")
        }else {
            $(template.find(".crear-empresa-form")).addClass("hide")
            $(template.find(".buscador-empresa")).removeClass("hide")
        }

    },
    'click .guardar-empresa'(event,template){
        let data = {
            nombre: template.find("[name='nombre']").value,
            ruc: template.find("[name='ruc']").value,
            bufeteId: Meteor.user().profile.bufeteId,
            autor: Meteor.userId()
        }
        let contactId = this._id;

        Meteor.call('agregarDatosEmpresa',data,function (err,result) {
            if(err) return Bert.alert('Error al crear la empresa','danger');

            result.nombre = data.nombre;
            result.ruc = data.ruc;

            Meteor.call('actualizarEmpresaContacto', result, contactId, function (err) {
                if(err) return Bert.alert('Error al actualizar los datos del contacto','danger');
                Bert.alert('Se actualizo la empresa correctamente','success')
            })

        })
    }
})
