Template.filtroAsuntoGastoModal.onRendered(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        if(Meteor.user().roles.bufete[0]=="administrador") return self.subscribe('asuntos',bufeteId);
        self.subscribe('asuntosxmiembro',Meteor.userId(),bufeteId);
    })
})

Template.filtroAsuntoGastoModal.onCreated(function () {

})

Template.filtroAsuntoGastoModal.events({
    'submit form'(event,template){
        event.preventDefault();
        Session.set('asunto-hora',template.find("[name='asunto']").value)
        Modal.hide('filtroAsuntoHoraModal');
    }
})


Template.filtroAsuntoGastoModal.helpers({
    asuntos(){
        return Asuntos.find();
    }
})
