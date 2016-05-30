Template.login.events({
	'submit form': ( event, template ) => {
		event.preventDefault();

    let user = {
      email: template.find( '[name="email"]' ).value,
      password: template.find( '[name="password"]' ).value
    }

    if ( user !== undefined ) {
      Meteor.loginWithPassword(user.email, user.password, function () {
        FlowRouter.go('/dashboard');
      });
    } else {
      Bert.alert( 'Ingrese sus datos', 'warning' );
    }
  }	
});