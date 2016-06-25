Template.filtroMiembroHoraModal.onCreated(function () {
    let self = this;
    self.autorun(function () {
        self.subscribe('miembros')
    })
})

Template.filtroMiembroHoraModal.onRendered(function () {

})

Template.filtroMiembroHoraModal.events({

})

Template.filtroMiembroHoraModal.helpers({
    miembros(){

    }
})
