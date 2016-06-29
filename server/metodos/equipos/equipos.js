Meteor.methods({
    'agregarEquipo'(data){
        check(data,Object);
        if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

          data.createdAt = new Date();
          Equipos.insert(data)

        } else {
          return;
        }

    }
})
