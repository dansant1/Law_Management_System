Meteor.methods({
    'añadirFacturasBorrador'(facturas){

        check(facturas,[Object]);

        if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

            facturas.forEach(function (factura) {
                factura.borrador = true

                Facturas.insert(factura)

            })

		} else {
			return;
		}
    }
})
