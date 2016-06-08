Template.facturacion.onRendered(function(){
	var self = this;
	var bufeteId = Meteor.user().profile.bufeteId
	self.autorun(function(){
				self.subscribe('horas',bufeteId)
	})
})

Template.facturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	horas(){
		return Horas.find();
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

