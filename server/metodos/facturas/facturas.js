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

                code += Facturas.find().count() ;

                console.log(Facturas.find().count());
                console.log(code);

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
                    },
                    $unset:{
                        estado:"",
                        ultimaModificacion:"",
                        modificadoPor:""
                    }
                },{
                    upsert:true
                });
            })

		} else {
			return;
		}
    },
    'actualizarEstadoBorrador'(estado,facturaId){
        check(estado,Object);
        check(facturaId,String)

        if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {


            Facturas.update({'_id':facturaId},
                {
                    $set:{
                        estado:estado,
                        ultimaModificacion: new Date(),
                        modificadoPor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
                    }
                }
            );

		} else {
			return;
		}

    }
})
