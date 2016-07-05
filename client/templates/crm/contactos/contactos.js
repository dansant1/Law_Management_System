Template.listaContactosCRM.onCreated(function () {
	let self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	Session.set('query',"");
	self.autorun(function () {
		self.subscribe('contactos',bufeteId)
	})
});

Template.listaContactosCRM.onRendered(function () {

});

Template.contactosCRM.events({
	'keyup .buscador-contacto'(event,template){
		Session.set('query',event.target.value);
	}
})


Template.listaContactosCRM.helpers({
	contactos(){
		var buscador = new RegExp(".*"+Session.get('query')+".*","i");

		let q= {
			$and:[
				{estatus:'contacto'},
				{ $or: [
				// {bufeteId:Meteor.user().profile.bufeteId},
					{'nombreCompleto':buscador},
					{'telefono':buscador},
					{'email': buscador},
					{'provincia': buscador},
					{'pais': buscador},
					{'email': buscador}
				]}
			]
		}

		return Clientes.find(q);
	}
});

Template.contactos2.onCreated(function () {
	var self = this;
	Session.set('nombre-contacto',"")

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('contactos', bufeteId);
   });
});

Template.contactos2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	clientes() {
		var regexNombre = new RegExp(".*"+Session.get('nombre-contacto')+".*","i");

		return Clientes.find({nombreCompleto:regexNombre, estatus: 'contacto'}, {sort: {createdAt: -1}});
	}
});

Template.contactos2.events({
	'keyup .buscador-contacto'(){
		Session.set('nombre-contacto',$(".buscador-contacto").val())
	}
})
