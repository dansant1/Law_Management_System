Template.filtroMiembroGastoModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('equipo',bufeteId)
    })
})

Template.filtroMiembroGastoModal.onRendered(function () {

})

Template.filtroMiembroGastoModal.events({
    'submit form'(event,template){
        event.preventDefault();
        Session.set('miembro-equipo',template.find("[name='miembro']").value);
        Modal.hide('filtroMiembroHoraModal');
    }
})

Template.filtroMiembroGastoModal.helpers({
    miembros(){
        return Meteor.users.find();
    }
})
