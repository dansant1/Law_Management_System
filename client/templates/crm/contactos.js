Template.listaContactosCRM.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('clientes', bufeteId);
   });
});

Template.listaContactosCRM.helpers({
	clientes() {
		return Clientes.find({});
	}
});