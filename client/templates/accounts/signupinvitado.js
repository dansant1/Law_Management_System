Template.signupInvitado.onCreated(function () {
	var self = this;
	
	self.autorun(function () {
		let invitadoId = FlowRouter.getParam('invitadoId');
    self.subscribe('invitacion', invitadoId);
	})
});

Template.signupInvitado.helpers({
	nombre() {
		return Invitados.findOne({_id: FlowRouter.getParam('invitadoId') }).nombre;
	},
	apellido() {
		return Invitados.findOne({_id: FlowRouter.getParam('invitadoId') }).apellido;
	},
	bufete() {
		return Invitados.findOne({_id: FlowRouter.getParam('invitadoId') }).bufete;
	},
	email() {
		return Invitados.findOne({_id: FlowRouter.getParam('invitadoId') }).email;
	}
});

Template.signupInvitado.events({
	'submit form': function (event, template) {
		event.preventDefault();

		let user = {
    		email: template.find( '[name="email"]' ).value,
    		password: template.find( '[name="password"]' ).value,
   			profile: {
   				nombre: template.find( '[name="nombre"]' ).value,
   				apellido: template.find( '[name="apellido"]' ).value
   			}
  		};	

  		let invitadoId = FlowRouter.getParam('invitadoId');

  		if (user.email !== "" && user.password !== "" && user.profile.nombre !== "" && user.profile.apellido !== "") {
        	Meteor.call('crearUsuarioInvitado', user, invitadoId, function (err, result) {
        		if ( err ) {
            		Bert.alert( err.reason, 'warning' );
          		} else {
           			let email     = user.email,
                		password  = user.password;
            			analytics.identify( result.userId, {
              				email: email,
              				name: user.profile.nombre + " " + user.profile.apellido
            			});

            

            Bert.alert( '¡Bienvenido!', 'success' );
            Meteor.loginWithPassword(email, password, function () {
                analytics.identify( Meteor.userId(), {
                  email: Meteor.user().emails[0].address,
                  name: Meteor.user().profile.name
                });
            });

            FlowRouter.go('/dashboard2');
        }
        });
      } else {
        Bert.alert( 'Ingrese sus datos', 'warning' );
      }

	}
});