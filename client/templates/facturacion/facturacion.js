Template.facturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.facturacion.events({
	'click .agregar-hora'(){
		Modal.show('agregarHoras')
	},
	'click .agregar-gasto'(){
		Modal.show('agregarGasto')
	}
})

