Template.filtroMiembroHoraModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('equipo',bufeteId)
    })
})

Template.filtroMiembroHoraModal.onRendered(function () {

})

Template.filtroMiembroHoraModal.events({
    'submit form'(event,template){
        event.preventDefault();
        Session.set('miembro-equipo',template.find("[name='miembro']").value);
        Modal.hide('filtroMiembroHoraModal');
    }
})

Template.filtroMiembroHoraModal.helpers({
    miembros(){
        return Meteor.users.find();
    }
})
