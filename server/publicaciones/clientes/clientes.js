Meteor.publish('clientes', function (bufeteId) {

	check(bufeteId, String);

	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

		return Clientes.find({bufeteId: bufeteId});

	} else {
		this.stop();
		return;
	}
});

Meteor.publish('contactos', function (bufeteId) {

  check(bufeteId, String);

  if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

    return Clientes.find({bufeteId: bufeteId, estatus: 'contacto'});

  } else {
    this.stop();
    return;
  }
});


Meteor.publish('prospectos', function (bufeteId) {

  check(bufeteId, String);

  if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

    return Clientes.find({bufeteId: bufeteId, estatus: 'prospecto'});

  } else {
    this.stop();
    return;
  }
});


Meteor.publish('clientesOficial', function (bufeteId) {

  check(bufeteId, String);
  var self = this

  if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

    return Clientes.find({bufeteId: bufeteId, estatus: 'cliente'});

/*    clientes = Clientes.aggregate([
      {$project:{
        fullname:{
          $concat:["$nombre"," ","$apellido"],
        },
        nombre:"$nombre",
        apellido:"$apellido",
        direccion:"$direccion",
        telefono:"$telefono",
        celular:"$celular",
        email:"$email",
        provincia:"$provincia",
        pais:"$pais",
        bufeteId:"$bufeteId",
        autor:"$autor",
        creadorId:"$creadorId",
        estatus:"$estatus",
        archivado:"$archivado"
      }}
    ]);

    _(clientes).each(function(cliente){
        self.added('clientes',Random.id(),{
        fullname: cliente.fullname,
        nombre: cliente.nombre,
        apellido:cliente.apellido,
        direccion:cliente.direccion,
        telefono:cliente.telefono,
        celular:cliente.celular,
        email:cliente.email,
        provincia:cliente.provincia,
        pais:cliente.pais,
        bufeteId:cliente.bufeteId,
        autor:cliente.autor,
        creadorId:cliente.creadorId,
        estatus:cliente.estatus,
        archivado:cliente.archivado
      })
    })*/



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

Meteor.publish('clientesxasuntosxmiembro',function (bufeteId,miembroId) {
	check(bufeteId,String)
	check(miembroId,String)
	
	if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

		let asuntos =  Asuntos.find({
			$and:[
				{
					$or:[
						{
							"abogados":{
								"$elemMatch":{id:miembroId}
							}
						},
						{
							creadorId: miembroId
						},
						{
							"responsable.id":miembroId
						}
					]
				},
				{
					bufeteId:bufeteId
				}
			]
		}).fetch();

		let clientes = _(asuntos).map(function (asunto,key) {
			return asunto.cliente.id;
		})

		console.log(clientes);

		return Clientes.find({_id:{$in:clientes}});

    } else {
      this.stop();
      return;
    }

})


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
