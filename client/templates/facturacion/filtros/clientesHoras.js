Template.filtroClienteHoraModal.onRendered(function () {
})

Template.filtroClienteHoraModal.onCreated(function () {
    let self  = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('clientesxasuntosxmiembro',bufeteId,Meteor.userId())
    })

})

Template.filtroClienteHoraModal.events({

})


Template.filtroClienteHoraModal.helpers({
    clientes(){
        return Clientes.find();
    }
})
