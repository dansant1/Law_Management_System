Template.usuarios.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
   });
});

Template.areaForm.events({
	'submit form'(event,template){
		event.preventDefault();
		debugger;
		var data={
			nombre: template.find("[name='nombre']").value,
			bufeteId: Meteor.user().profile.bufeteId
		}

		Meteor.call('agregarArea',data,function (err) {
			if (err) {
				template.find("[name='nombre']").value = "";
				Bert.alert('Hubo un error al agregar la area','danger');
			} else {
				template.find("[name='nombre']").value = "";
				Bert.alert('Se añadio la area correctamente','success')
			}
			
		})
	}
})

Template.usuarioNuevo.events({
	'click .__user': () => {
		Modal.show('usuarioForm');
	}
});

Template.usuarios.helpers({
	miembros: function () {
		return Meteor.users.find();
	}
});

Template.usuarioNuevo.helpers({
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.usuarioForm.onCreated(function () {
	var self = this;
	let bufeteId = Meteor.user().profile.bufeteId
	self.autorun(function () {
		self.subscribe('areas',bufeteId);
	})
})

Template.usuarioForm.helpers({
	areas(){
		return Areas.find()
	}
});

Template.usuarioForm.events({
	'submit form': (event, template) => {
		event.preventDefault();

		let datos = {
			email: template.find( '[name="email"]' ).value,
    		password: template.find( '[name="password"]' ).value,
   			profile: {
   				nombre: template.find( '[name="nombre"]' ).value,
   				apellido: template.find( '[name="apellido"]' ).value,
					telefono: template.find('[name="telefono"]').value,
					tipo: template.find('[name="tipo"]').value,
				area:{
					id:template.find('.areas').value,
					nombre: template.find('.areas option:selected').innerHTML
				}
   			}
		}

		datos.profile.bufete = Meteor.user().profile.bufete;
		datos.profile.bufeteId = Meteor.user().profile.bufeteId;

		if (datos !== undefined) {
			Meteor.call('agregarUsuarioEquipo', datos, function (err, result) {
				Bert.alert( 'Agregaste un nuevo usuario al equipo', 'success' );

				template.find( '[name="email"]' ).value = "";
				template.find( '[name="password"]' ).value = "";
				template.find( '[name="nombre"]' ).value = "";
				template.find( '[name="apellido"]' ).value = "";
				template.find( '[name="telefono"]').value = "";
			});
		} else {
			Bert.alert( 'Ingrese sus datos', 'warning' );
		}

	}
});


Template.usuarioForm2.onCreated(function () {
	var self = this;
	let bufeteId = Meteor.user().profile.bufeteId
	self.autorun(function () {
		self.subscribe('areas',bufeteId);
	})
})

Template.usuarioForm2.helpers({
	areas(){
		return Areas.find()
	}
});

Template.usuarioForm2.events({
	'click .agregar-miembro': (event, template) => {
		event.preventDefault();

		let datos = {
			email: template.find( '[name="email"]' ).value,
    		password: template.find( '[name="password"]' ).value,
   			profile: {
   				nombre: template.find( '[name="nombre"]' ).value,
   				apellido: template.find( '[name="apellido"]' ).value,
					telefono: template.find('[name="telefono"]').value,
					tipo: template.find('[name="tipo"]').value,
				area:{
					id:template.find('.areas').value,
					nombre: template.find('.areas option:selected').innerHTML
				}
   			}
		}

		datos.profile.bufete = Meteor.user().profile.bufete;
		datos.profile.bufeteId = Meteor.user().profile.bufeteId;

		if (datos.profile.nombre !== "" && datos.profile.apellido !== "" && datos.profile.tipo !== "" && datos.password !== "" && datos.email !== "") {
			Meteor.call('agregarUsuarioEquipo', datos, function (err, result) {
				Bert.alert( 'Agregaste un nuevo usuario al equipo', 'success' );
				analytics.identify( result.userId, {
              		email: datos.email,
              		name: datos.profile.nombre + " " + datos.profile.apellido
            	});
				Modal.hide('usuarioForm2');
			});
		} else {
			Bert.alert( 'Ingrese sus datos', 'warning' );
		}

	}
});

Template.invitarMiembro.onCreated(function () {
	var self = this;
	let bufeteId = Meteor.user().profile.bufeteId
	self.autorun(function () {
		self.subscribe('areas',bufeteId);
	})
});

Template.invitarMiembro.helpers({
	areas(){
		return Areas.find()
	}
});

Template.invitarMiembro.events({
	'click .agregar-miembro': function (event, template) {
		event.preventDefault();

		let datos = {
			email: template.find( '[name="email"]' ).value,
   			nombre: template.find( '[name="nombre"]' ).value,
   			apellido: template.find( '[name="apellido"]' ).value,
			tipo: template.find('[name="tipo"]').value,
			area: {
				id:template.find('.areas').value,
				nombre: template.find('.areas option:selected').innerHTML
			}
		}

		if (datos.email !== "" && datos.nombre !== "" && datos.apellido !== "") {

			Meteor.call('invitar', datos, function (err, result) {

				Bert.alert( 'Agregaste un nuevo usuario al equipo', 'success' );

				template.find( '[name="email"]' ).value = "";
				template.find( '[name="nombre"]' ).value = "";
				template.find( '[name="apellido"]' ).value = "";
	
			});
		} else {
			Bert.alert( 'Ingrese sus datos', 'warning' );
		}
	}
});