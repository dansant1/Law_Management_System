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

Template.listaContactosCRM.events({
	'click .añadir-empresa'(event,template){
		Modal.show('crearEmpresaContacto',this)
	},
	'click .eliminar-contacto'(event,template){
		swal({  title: "¿Seguro que quieres eliminar este contacto?",
				text: "Este contacto ya no estara disponible para el resto de tu equipo",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, eliminar contacto",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: false
			},
			function() {
				let contactId = $(event.target).data('id');
				Meteor.call('eliminarContacto',contactId,function (err) {
					if(err) return Bert.alert('Hubo un error al momento de eliminar','danger');
					swal('Contacto eliminado','El contacto se elimino correctamente','success')
				})
				/*let asuntoId = FlowRouter.getParam('asuntoId');
				Meteor.call('cerrarAsunto', asuntoId, function (err) {
					if (err) {
						Bert.alert('Hubo un error, vuelve a intentalo', 'warning');
					} else {
						swal("Asunto cerrado", "El asunto ha sido cerrado correctamente.", "success");
					}

				}); */
				// swal("Asunto cerrado", "El asunto ha sido cerrado correctamente.", "success");
			});
	}
})

Template.contactosCRM.events({
	'keyup .buscador-contacto'(event,template){
		Session.set('query',event.target.value);
	},
	'click .contacto'(event,template){
		Session.set('estatus','contacto')
	},
	'click .cliente'(){
		Session.set('estatus','cliente')
	},
	'click .prospecto'(){
		Session.set('estatus','prospecto')
	}

})


Template.listaContactosCRM.helpers({
	contactos(){
		var buscador = new RegExp(".*"+Session.get('query')+".*","i");

		let q= {
			$and:[
				{estatus:Session.get('estatus')},
				{ $or: [
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
			]
		}

		return Clientes.find(q);
	}
});

Template.contactos2.onCreated(function () {
	var self = this;
	Session.set('nombre-contacto',"")
	Session.set('estatus','contacto')
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
