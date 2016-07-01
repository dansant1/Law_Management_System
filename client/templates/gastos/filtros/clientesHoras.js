Template.filtroClienteGastoModal.onRendered(function () {
})

Template.filtroClienteGastoModal.onCreated(function () {
    let self  = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        if(Meteor.user().roles.bufete[0]!="administrador") return self.subscribe('clientesxasuntosxmiembro',bufeteId,Meteor.userId())
        self.subscribe('clientes',bufeteId);
    })

})

Template.filtroClienteGastoModal.events({
    'submit form'(event,template){
        event.preventDefault();
        debugger;
        Session.set('cliente-hora',template.find("[name='cliente']").value);
        Modal.hide('filtroClienteHoraModal');
    }
})


Template.filtroClienteGastoModal.helpers({
    clientes(){
        return Clientes.find();
    }
})
