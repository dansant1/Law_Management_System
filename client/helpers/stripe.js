Meteor.startup( function() {

	var stripeKey = Meteor.settings.public.stripe.testPublishableKey;
	
  	Stripe.setPublishableKey( stripeKey );

  	STRIPE = {

    		getToken: function( domElement, card, callback ) {
      		
      		Stripe.card.createToken( card, function( status, response ) {
        			
        			if ( response.error ) {
          				Bert.alert( response.error.message, "danger" );
        			} else {
          				STRIPE.setToken( response.id, domElement, callback );
        			}

      		});

    		},
    		setToken: function( token, domElement, callback ) {
      		
      		$( domElement ).append( $( "<input type='hidden' name='stripeToken' />" ).val( token ) );
      		callback();
    		
    		}

  	};
});