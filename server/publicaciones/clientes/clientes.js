Meteor.publish('clientes', function (bufeteId) {
	
	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

		return Clientes.find({bufeteId: bufeteId});

	} else {
		this.stop();
		return;
	}
});


Meteor.publish('empresas', function (bufeteId) {
  
  check(bufeteId, String);

  if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

    return Empresas.find({bufeteId: bufeteId});

  } else {
    this.stop();
    return;
  }
});


Meteor.publish('contacto', function (contactoId) {
  
  check(contactoId, String);

  if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

    return Clientes.find({_id: contactoId});

  } else {
    this.stop();
    return;
  }
});



Meteor.publish( 'clients', function( search, bufeteId ) {
  check( search, Match.OneOf( String, null, undefined ) );
  check(bufeteId, String);

  let query      = {},
      projection = { limit: 10, sort: { nombre: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    
    query = {
      $or: [
        { nombre: regex },
        { apellido: regex },
        { pais: regex },
        { identificacion: regex},
        { provincia: regex},
        { telefono: regex},
        { celular: regex},
        { email: regex},
        { direcccion: regex}
      ] 
    }

    projection.limit = 100;
  }

  return Clientes.find( query, projection );
});