Template.login.events({
	'submit form': ( event, template ) => {
		event.preventDefault();

    let user = {
      email: template.find( '[name="email"]' ).value,
      password: template.find( '[name="password"]' ).value
    }

    if ( user !== undefined )
      return Meteor.loginWithPassword(user.email, user.password, function (err) {
            if(err) return Bert.alert('Error en el usuario o contraseña, intentelo nuevamente','danger');
            FlowRouter.go('/dashboard2');
      });

    Bert.alert( 'Ingrese sus datos', 'warning' );
  }
});