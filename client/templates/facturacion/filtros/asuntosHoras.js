Template.filtroAsuntoHoraModal.onRendered(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        if(Meteor.user().roles.bufete[0]=="administrador") return self.subscribe('asuntos',bufeteId);
        self.subscribe('asuntosxmiembro',Meteor.userId(),bufeteId);
    })
})

Template.filtroAsuntoHoraModal.onCreated(function () {

})

Template.filtroAsuntoHoraModal.events({
    'submit form'(event,template){
        event.preventDefault();
        Session.set('asunto-hora',template.find("[name='asunto']").value)
        Modal.hide('filtroAsuntoHoraModal');
    }
})


Template.filtroAsuntoHoraModal.helpers({
    asuntos(){
        return Asuntos.find();
    }
})
