Template.filtroClienteHoraModal.onRendered(function () {
})

Template.filtroClienteHoraModal.onCreated(function () {
    let self  = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        if(Meteor.user().roles.bufete[0]!="administrador") return self.subscribe('clientesxasuntosxmiembro',bufeteId,Meteor.userId())
        self.subscribe('clientes',bufeteId);
    })

})

Template.filtroClienteHoraModal.events({
    'submit form'(event,template){
        event.preventDefault();
        debugger;
        Session.set('cliente-hora',template.find("[name='cliente']").value);
        Modal.hide('filtroClienteHoraModal');
    }
})


Template.filtroClienteHoraModal.helpers({
    clientes(){
        return Clientes.find();
    }
})
