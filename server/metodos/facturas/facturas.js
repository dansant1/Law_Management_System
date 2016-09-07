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
});

function getMontoDeHora (horaId, responsableId, tarifaId) {

    let tarifa = Tarifas.findOne({_id: tarifaId});
    let hora = Horas.findOne({_id: horaId });
    let precio  = 0;

    tarifa.miembros.some( miembro => {

        if ( miembro.id === responsableId ) {

            let precioxminutos = miembro.soles/60*hora.minutos;

            precio = ( hora.horas * miembro.soles ) + precioxminutos;

            return precio;

        }

    });

    return precio;

}

function precioDelResponsable (responsableId) {
    return 1;
}

function obtenerCostoDeAsuntoRetainer (asuntoId) {
    
    let maximoHoras = Asuntos.findOne({_id: asuntoId}).facturacion.retainer.horas_maxima;
    let horas = Horas.find({'asunto.id': asuntoId, cobrable: true, facturado: false});
    let horasTranscurridas = 0;
    let diferencia;
    let costo;

    horas.forEach( h => {
        // Algoritmo
        horasTranscurridas += h.horas; // h.minutos

        if (horasTranscurridas > maximoHoras) {
            diferencia = horasTranscurridas - maximoHoras;
            costo = diferencia * precioDelResponsable(h.responsable.id);
        }

    });

    return costo;

}




Meteor.methods({
    facturar: function (datos) {
        check(datos, {
            emision: String,
            vencimiento: String,
            detalles: Number,
            combinar: Boolean,
            igv: Boolean,
            aprobado: Boolean,
            asuntos: Array
        });

        let factura = {};

        if ( this.userId ) {

           

            if ( datos.combinar === true ) {

                if (datos.aprobado === true) {

                    factura['aprobado'] = true;
                    factura['estado'] = 'pendiente';

                } else {

                    factura['aprobado'] = false;
                    factura['estado'] = 'borrador';

                }

                factura.igv = datos.igv;

                switch (datos.detalles) {
                    case 1: // Todos los detalles 

                        datos.asuntos.map( (a) => {

                            let asunto = Asuntos.findOne({_id: a.id});

                            let horas = Horas.find({'asunto.id': a.id, cobrable: true, facturado: false});
                            let gastos = Gastos.find({'asunto.id': a.id, administrativo: false, pagado: false});

                            if (asunto.facturacion.forma_cobro === "horas hombre") {

                                var hours = [];

                                horas.forEach( h => {
                                    
                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                    hours.push({
                                        tipo: 'Servicio',
                                        id: h._id,
                                        descripcion: h.descripcion,
                                        cantidad: h.horas + '.' + h.minutos,
                                        monto: getMontoDeHora(h._id, h.responsable.id, asunto.facturacion.tarifa.id)
                                    });

                                });

                                var expenses = [];

                                gastos.forEach( g => {

                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });
                                    
                                    expenses.push({
                                        tipo: 'Gasto',
                                        id: g._id,
                                        descripcion: g.descripcion,
                                        monto: g.monto
                                    });
                                });

                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    horas: hours,
                                    gastos: expenses
                                });


                            } else if (asunto.facturacion.forma_cobro === "flat fee") {

                                var expense = [];

                                gastos.forEach( g => {

                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });
                                    
                                    expense.push({
                                        tipo: 'Gasto',
                                        id: g._id,
                                        descripcion: g.descripcion,
                                        monto: g.monto
                                    });

                                });

                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    monto: {
                                        tipo: 'Servicio',
                                        descripcion: asunto.caratula,
                                        monto: asunto.montogeneral
                                    },
                                    gastos: expense
                                });


                            } else if (asunto.facturacion.forma_cobro === "retainer") {

                            }
                        
                        });

                        Facturas.insert(factura);

                    break;
                    case 2: // Resumen de actividad

                        datos.asuntos.map( a => {

                            let asunto = Asuntos.findOne({_id: a.id});

                            let horas = Horas.find({'asunto.id': a.id, cobrable: true, facturado: false});
                            let gastos = Gastos.find({'asunto.id': a.id, administrativo: false, pagado: false});

                            if (asunto.facturacion.forma_cobro === "horas hombre") {

                                var hours = {};
                                hours.total = 0;
                                hours.id = [];
                                horas.forEach( h => {

                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                    hours.id.push(h._id);
                                    
                                    hours.total += getMontoDeHora(h._id, h.responsable.id, asunto.facturacion.tarifa.id);
                                    
                                });

                                hours.descripcion = 'Horas de trabajo';

                                var expenses = {};
                                expenses.total = 0;
                                expenses.gastosId = [];
                                gastos.forEach( g => {
                                    
                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expenses.gastosId.push(g._id);

                                    expenses.total += g.monto;

                                });

                                expenses.descripcion = 'Gastos administrativos'

                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    horas: hours,
                                    gastos: expenses
                                });

                            } else if (asunto.facturacion.forma_cobro === "flat fee") {

                                var expense = {};

                                expense.total = 0;

                                expense.gastosId = [];

                                gastos.forEach( g => {

                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expense.gastosId.push(g._id);
                                    
                                    expense.total += g.monto;

                                });

                                expense.descripcion = 'Gastos administrativos';

                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    monto: {
                                        tipo: 'Servicio',
                                        descripcion: asunto.caratula,
                                        monto: asunto.montogeneral
                                    },
                                    gastos: expense
                                });

                            } else if (asunto.facturacion.forma_cobro === "retainer") {

                            }

                        });

                        Facturas.insert(factura);

                    break;
                    case 3: // Agregado -> Todo el una linea
                        
                        datos.asuntos.map( a => {

                            let asunto = Asuntos.findOne({_id: a.id});

                            let horas = Horas.find({'asunto.id': a.id, cobrable: true, facturado: false});
                            let gastos = Gastos.find({'asunto.id': a.id, administrativo: false, pagado: false});

                            if (asunto.facturacion.forma_cobro === "horas hombre") {

                                var hours = {};
                                hours.total = 0;
                                hours.id = [];
                                horas.forEach( h => {

                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });
                                    
                                    hours.id.push(h._id);

                                    hours.total += getMontoDeHora(h._id, h.responsable.id, asunto.facturacion.tarifa.id);
                                    
                                });

                                var expenses = {};
                                expenses.total = 0;
                                expenses.gastosId = [];
                                gastos.forEach( g => {
                                    
                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expenses.gastosId.push(g._id);

                                    expenses.total += g.monto;

                                });

                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    total: hours.total + expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                });                                

                            } else if (asunto.facturacion.forma_cobro === "flat fee") {
                                
                                var expense = {};
                                expense.total = 0;
                                expense.gastosId = [];
                                gastos.forEach( g => {

                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expense.gastosId.push(g._id);
                                    
                                    expense.total += g.monto;

                                });

                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    total: asunto.montogeneral + expense.total,
                                    descripcion: {
                                        tipo: 'Flat fee y Gastos',
                                        cantidad: 1
                                    }
                                });         
                            } else if (asunto.facturacion.forma_cobro === "retainer") {

                                var expenses = {};
                                expenses.total = 0;
                                expenses.gastosId = [];
                                gastos.forEach( g => {
                                    
                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expenses.gastosId.push(g._id);

                                    expenses.total += g.monto;

                                });

                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    total: asunto.facturacion.retainer.monto + expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                });             
                            }

                        });

                        Facturas.insert(factura);
                    break;
                }

            } else {
                return;
            }

        } else {
            return;
        }

        
    }
});
