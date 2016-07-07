Template.listaEmpresasCRM.onCreated(function () {
	let self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	Session.set('query',"");
	self.autorun(function () {
		self.subscribe('contactos',bufeteId)
	})
});

Template.listaContactosCRM.onRendered(function () {

});

Template.listaEmpresasCRM.events({
	'click .añadir-empresa'(event,template){
		Modal.show('crearEmpresaContacto',this)
	}
})

Template.empresasCRM.events({
	'keyup .buscador-contacto'(event,template){
		Session.set('query',event.target.value);
	}
})


Template.listaEmpresasCRM.helpers({
	empresas(){
		var buscador = new RegExp(".*"+Session.get('query')+".*","i");

		let q= { $or: [
				// {bufeteId:Meteor.user().profile.bufeteId},
			{'nombreCompleto':buscador},
			{'telefono':buscador},
			{'email': buscador},
			{'provincia': buscador},
			{'pais': buscador},
			{'email': buscador},
			{'empresa.nombre':buscador},
			{'empresa.ruc':buscador},
			{'celular':buscador}
		]}

		return Empresas.find({});
	}
});

Template.empresas.onCreated(function () {
	var self = this;
	Session.set('nombre-contacto',"")

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('empresas', bufeteId);
   });
});

Template.empresas.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.empresas.events({
	'keyup .buscador-contacto'(){
		Session.set('nombre-contacto',$(".buscador-contacto").val())
	}
})
