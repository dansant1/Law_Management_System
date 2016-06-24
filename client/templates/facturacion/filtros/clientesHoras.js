Template.filtroClienteHoraModal.onRendered(function () {
})

Template.filtroClienteHoraModal.onCreated(function () {
    let self  = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        if(Meteor.user().profile.roles.bufete[0]!="administrador") return self.subscribe('clientesxasuntosxmiembro',bufeteId,Meteor.userId())
        self.subscribe('clientes',bufeteId);
    })

})

Template.filtroClienteHoraModal.events({

})


Template.filtroClienteHoraModal.helpers({
    clientes(){
        return Clientes.find();
    }
})
