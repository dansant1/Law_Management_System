Template.borradores.events({

})


Template.borradores.helpers({
	email() {
		return Meteor.user().emails[0].address;
	}
})

Template.listaClientesBorradores.helpers({
    facturas(){
        return Facturas.find({borrador:true});
    }
})

Template.borradores.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('facturas',bufeteId);
    })
})

Template.borradores.onRendered(function () {

})

Template.borradoresxCliente.events({
	'click .guardar-cobro'(){
		Modal.show('generarCobroFacturaModal',this)
	}
})
