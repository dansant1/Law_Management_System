Meteor.methods({
    'registrarTarifa'(tarifa){
        check(tarifa,Object);

        if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
            Tarifas.insert(tarifa)
		} else {
			return;
		}

    }
})
