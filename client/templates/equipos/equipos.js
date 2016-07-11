Template.crearEquipoModal.onRendered(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('equipo',bufeteId)
    })
});

Template.crearEquipoModal.events({
    'click .agregar-equipo'(event,template){
        debugger;
        event.preventDefault();
        let data ={}
        data.nombre = template.find("[name='nombre']").value;
        data.miembros = []
        data.bufeteId = Meteor.user().profile.bufeteId;
        data.creadorId = Meteor.user()._id;
        $($(".miembros-equipo:checked")).each(function () {
            let miembro = Meteor.users.find({_id:$(this).val()}).fetch()[0];
            data.miembros.push({
                id: $(this).val(),
                nombre: miembro.profile.nombre + " " + miembro.profile.apellido
            })
        })

        Meteor.call('agregarEquipo',data,function (err) {
            if(err) return Bert.alert('No se pudo añadir el equipo correctamente','danger');
            Bert.alert('Se añadio correctamente el equipo','success')
            Modal.hide('crearEquipoModal');
        })

    }
})

Template.crearEquipoModal.helpers({
    miembros(){
        return Meteor.users.find();
    }
})
