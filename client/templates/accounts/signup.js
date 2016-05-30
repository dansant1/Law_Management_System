Template.signup.events({
	'submit form': ( event, template ) => {
		event.preventDefault();

		let user = {
    		email: template.find( '[name="email"]' ).value,
    		password: template.find( '[name="password"]' ).value,
   			profile: {
   				nombre: template.find( '[name="nombre"]' ).value,
   				apellido: template.find( '[name="apellido"]' ).value,
          bufete: template.find( '[name="bufete"]' ).value
   			}
  		};

  		if (user !== undefined) {
        Meteor.call('crearUsuario', user, function (err, result) {
        if ( err ) {
            Bert.alert( err.reason, 'warning' );
          } else {

            let email     = user.email,
                password  = user.password;

            Bert.alert( '¡Bienvenido!', 'success' );
            Meteor.loginWithPassword(email, password, function () {
                
            });

            FlowRouter.go('/dashboard2');
          }
        });
      } else {
        Bert.alert( 'Ingrese sus datos', 'warning' );
      }
	}
});