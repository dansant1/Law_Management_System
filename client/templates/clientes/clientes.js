Template.clientes.onCreated( () => {
  
 	let template = Template.instance();

  	template.searchQuery = new ReactiveVar();
  	template.searching   = new ReactiveVar( false );

  	template.autorun( () => {

  		let bufeteId = Meteor.user().profile.bufeteId;
    	template.subscribe( 'clients', template.searchQuery.get(), bufeteId, () => {
      		setTimeout( () => {
        		template.searching.set( false );
      		}, 300 );
    	});
  	
  	});

});

Template.clientes.helpers({
	searching() {
    	return Template.instance().searching.get();
  	},
  	query() {
    	return Template.instance().searchQuery.get();
  	},
	clientes() {
		let clientes = Clientes.find({bufeteId: Meteor.user().profile.bufeteId});
    	
    	if ( clientes ) {
      		return clientes;
    	} 
	},
	hola() {
		return Meteor.user().profile.nombre
	}
});

Template.clientes.events({
	'keyup [name="search"]' ( event, template ) {
    	
    	let value = event.target.value.trim();

    	if ( value !== '' && event.keyCode === 13) {
      		template.searchQuery.set( value );
      		template.searching.set( true );
    	}

    	if ( value === '' ) {
      		template.searchQuery.set( value );
    	}
  	}
});

Template.clienteBotom.helpers({
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.clienteNuevo.events({
	'submit form': function (event, template) {
		event.preventDefault();

		let datos = {
			nombre: template.find('[name="nombre"]').value,
			apellido: template.find('[name="apellido"]').value,
			direccion: template.find('[name="direccion"]').value,
			telefono: template.find('[name="telefono"]').value,
			celular: template.find('[name="celular"]').value,
			email: template.find('[name="email"]').value,
			identificacion: template.find('[name="dni"]').value,
			provincia: template.find('[name="provincia"]').value,
			pais: template.find('[name="pais"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
		} 

		if (datos.nombre !== "") {
			Meteor.call('crearCliente', datos, function (err, result) {

				if (err) {
					console.log('algo salio mal :(');
				} else {

					template.find('[name="nombre"]').value = "";
					template.find('[name="apellido"]').value ="" ;
					template.find('[name="direccion"]').value = "";
					template.find('[name="telefono"]').value = "";
					template.find('[name="celular"]').value = "";
					template.find('[name="email"]').value = "";
					template.find('[name="dni"]').value = "";
					template.find('[name="provincia"]').value = "";
					template.find('[name="pais"]').value = "";

					FlowRouter.go('/clientes2');
				}
			});
		} else {
			Bert.alert( 'Ingrese los datos', 'warning' );
		}
	}
});

Template.detalleCliente.onCreated( function () {
  
 	var self = this;

	self.autorun(function() {
		let contactoId = FlowRouter.getParam('_id');
    	self.subscribe('contacto', contactoId);
   });

});

Template.datosCliente.onCreated( function () {
  
 	var self = this;

	self.autorun(function() {
		let contactoId = FlowRouter.getParam('_id');
    	self.subscribe('contacto', contactoId);
   });

});

Template.datosCliente.helpers({
	contacto() {
		return Clientes.findOne();
	},
	dia(fecha) {
		var d = fecha,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		  return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	},
	contactoId() {
		return FlowRouter.getParam('_id');
	}
});

Template.detalleCliente.helpers({
	contacto() {
		return Clientes.findOne();
	},
	dia(fecha) {
		var d = fecha,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		  return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.menuCliente.helpers({
	contactoId() {
		return FlowRouter.getParam('_id');
	}
});

Template.datosCliente.events({
	'click .archivar': function () {
		swal({  title: "¿Seguro que quieres archivar este contacto?",   
				text: "Este contacto ya no estara disponible para el resto de tu equipo",   
				type: "warning",   
				showCancelButton: true,   
				confirmButtonColor: "#e74c3c",   
				confirmButtonText: "Si, archivar contacto",   
				cancelButtonText: "No, cancelar",
				closeOnConfirm: false 
			}, 
			function() {
				/*let asuntoId = FlowRouter.getParam('asuntoId');
				Meteor.call('cerrarAsunto', asuntoId, function (err) {
					if (err) {
						Bert.alert('Hubo un error, vuelve a intentalo', 'warning');
					} else {
						swal("Contacto archivado", "El contacto ha sido archivado correctamente.", "success");	
					}
							
				}); */
				swal("Contacto archivado", "El contacto ha sido archivado correctamente.", "success"); 
			});
	},
	'click imprimir': function () {

	}
});

Template.asuntoxCliente.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let contactoId = FlowRouter.getParam('_id');
    	self.subscribe('asuntosxCliente', contactoId);
   });
});

Template.asuntoxCliente.helpers({
	asuntos() {
		return Asuntos.find({});
	}
});