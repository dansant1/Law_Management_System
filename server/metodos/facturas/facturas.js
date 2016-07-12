Meteor.methods({
    'añadirFacturasBorrador'(facturas){

        check(facturas,[Object]);

        if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

            facturas.forEach(function (factura) {

                let num = String(Facturas.find().count()).length;
                let diff = 9 - num;
                let code = ""
                for (var i = 0; i < diff; i++) {
                    code += "0";
                }
                if(num>0) code = code + Facturas.find().count() ;

                factura.codigo = code;
                factura.bufeteId = Meteor.user().profile.bufeteId;
                factura.borrador = true;

                Facturas.update({'cliente.id':factura.cliente.id},
                {
                    $set:{
                        codigo: factura.codigo,
                        cliente: factura.cliente,
                        facturarPor: factura.facturarPor,
                        borrador:true,
                        bufeteId:factura.bufeteId
                    }
                },{
                    upsert:true
                });
            })

		} else {
			return;
		}
    }
})
