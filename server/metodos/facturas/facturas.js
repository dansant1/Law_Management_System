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

function precioDelResponsable (responsableId, tarifaId) {
    let tarifa = Tarifas.findOne({_id: tarifaId});
    
    let precioxminutos = 0;

    tarifa.miembros.some( miembro => {

        if ( miembro.id === responsableId ) {

            precioxminutos = miembro.soles;

            return precioxminutos;
        }

    });

    return precioxminutos;
    
}

function precioDelResponsableMinutos (responsableId, tarifaId) {
    let tarifa = Tarifas.findOne({_id: tarifaId});
    
    let precioxhoras = 0;

    tarifa.miembros.some( miembro => {

        if ( miembro.id === responsableId ) {

            precioxhoras = miembro.soles/60;

            return precioxhoras;
        }

    });

    return precioxhoras;
}

function obtenerCostoDeAsuntoRetainer (asuntoId, tarifaId) {
    
    let maximoHoras = Asuntos.findOne({_id: asuntoId}).facturacion.retainer.horas_maxima;
    let horas = Horas.find({'asunto.id': asuntoId, cobrable: true, facturado: false});
    let horasTranscurridas = 0;
    let minutosTranscurridos = 0;
    let costo = 0;

    horas.forEach( h => {
        
        /*Horas.update({_id: h._id}, {
            $set: {
                facturado: true
            }
        });*/

        // Algoritmo

        if (horasTranscurridas !== 0) {

            horasTranscurridas += h.horas;
            minutosTranscurridos += h.minutos;

            if (minutosTranscurridos >= 60) {
                horasTranscurridas++
                minutosTranscurridos -= 60;
            }

        } else {
            horasTranscurridas = h.horas;
            minutosTranscurridos = h.minutos;
        }

        if (horasTranscurridas >= maximoHoras) {
            console.log(precioDelResponsable(h.responsable.id, tarifaId));
            console.log(precioDelResponsableMinutos(h.responsable.id, tarifaId));
            costoHoras = (horasTranscurridas - maximoHoras) * precioDelResponsable(h.responsable.id, tarifaId);
            costoMinutos = minutosTranscurridos * precioDelResponsableMinutos(h.responsable.id, tarifaId);
            costo = costoHoras + costoMinutos;
            return costo;
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
            //clientes: Object,
            asuntos: Array
        });

        let factura = {};

        factura.asunto = [];

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

                        datos.asuntos.map( a => {
                            console.log(a.id);
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
                                    console.log(h._id);
                                    console.log(h.responsable.id);
                                    console.log(asunto.facturacion.tarifa.id);
                                    console.log( getMontoDeHora(h._id, h.responsable.id, asunto.facturacion.tarifa.id) );
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

                                horas.forEach( h => {
                                    
                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                });

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
                                console.log(factura.asunto);
                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    monto: {
                                        tipo: 'Servicio',
                                        descripcion: asunto.caratula,
                                        monto: asunto.facturacion.montogeneral
                                    },
                                    gastos: expense
                                });

                                // Cuando se crea la factura de un flat fee
                                // El monto general (flat fee) se vuelve 0
                                // Si el abogado elimina el borrador o la factura en si, entonces regresa al monto general de antes
                                Asunto.update({_id: asunto3._id}, {
                                    $set: {
                                        'facturacion.montogeneral': 0 
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
                                    monto: {
                                        tipo: 'Servicio',
                                        descripcion: asunto.caratula,
                                        monto: asunto.facturacion.retainer.monto + obtenerCostoDeAsuntoRetainer(asunto._id, asunto.facturacion.tarifa.id)
                                    },
                                    gastos: expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                }); 
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


                                horas.forEach( h => {
                                    
                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                });

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
                                        monto: asunto.facturacion.montogeneral
                                    },
                                    gastos: expense
                                });

                                // Cuando se crea la factura de un flat fee
                                // El monto general (flat fee) se vuelve 0
                                // Si el abogado elimina el borrador o la factura en si, entonces regresa al monto general de antes
                                Asunto.update({_id: asunto3._id}, {
                                    $set: {
                                        'facturacion.montogeneral': 0 
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
                                    monto: asunto.facturacion.retainer.monto + obtenerCostoDeAsuntoRetainer(asunto._id, asunto.facturacion.tarifa.id),
                                    gastos: expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                });             
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

                                horas.forEach( h => {
                                    
                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                });

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
                                    total: asunto.facturacion.montogeneral + expense.total,
                                    descripcion: {
                                        tipo: 'Flat fee y Gastos',
                                        cantidad: 1
                                    }
                                });     

                                // Cuando se crea la factura de un flat fee
                                // El monto general (flat fee) se vuelve 0
                                // Si el abogado elimina el borrador o la factura en si, entonces regresa al monto general de antes
                                Asunto.update({_id: asunto3._id}, {
                                    $set: {
                                        'facturacion.montogeneral': 0 
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
                                    total: asunto.facturacion.retainer.monto + obtenerCostoDeAsuntoRetainer(asunto._id, asunto.facturacion.tarifa.id) + expenses.total,
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

            } else { // Si no es combinado

                if (datos.aprobado === true) {

                    factura['aprobado'] = true;
                    factura['estado'] = 'pendiente';

                } else {

                    factura['aprobado'] = false;
                    factura['estado'] = 'borrador';

                }

                factura.igv = datos.igv;

                datos.asuntos.map( a => {
                    
                    switch(datos.detalles) {
                        
                        case 1:
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

                                horas.forEach( h => {
                                    
                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                });

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
                                        monto: asunto.facturacion.montogeneral
                                    },
                                    gastos: expense
                                });

                                // Cuando se crea la factura de un flat fee
                                // El monto general (flat fee) se vuelve 0
                                // Si el abogado elimina el borrador o la factura en si, entonces regresa al monto general de antes
                                Asunto.update({_id: asunto3._id}, {
                                    $set: {
                                        'facturacion.montogeneral': 0 
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
                                console.log(obtenerCostoDeAsuntoRetainer(asunto._id, asunto.facturacion.tarifa.id));
                                factura.asunto.push({
                                    nombre: asunto.caratula,
                                    id: asunto._id,
                                    monto: {
                                        tipo: 'Servicio',
                                        descripcion: asunto.caratula,
                                        monto: asunto.facturacion.retainer.monto + obtenerCostoDeAsuntoRetainer(asunto._id, asunto.facturacion.tarifa.id)
                                    },
                                    gastos: expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                }); 
                            }

                            Facturas.insert(factura);

                        break;

                        case 2:
                            let asunto2 = Asuntos.findOne({_id: a.id});

                            let horas2 = Horas.find({'asunto.id': a.id, cobrable: true, facturado: false});
                            let gastos2 = Gastos.find({'asunto.id': a.id, administrativo: false, pagado: false});

                            if (asunto2.facturacion.forma_cobro === "horas hombre") {

                                var hours = {};
                                hours.total = 0;
                                hours.id = [];
                                horas2.forEach( h => {

                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                    hours.id.push(h._id);
                                    
                                    hours.total += getMontoDeHora(h._id, h.responsable.id, asunto2.facturacion.tarifa.id);
                                    
                                });

                                hours.descripcion = 'Horas de trabajo';

                                var expenses = {};
                                expenses.total = 0;
                                expenses.gastosId = [];
                                gastos2.forEach( g => {
                                    
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
                                    nombre: asunto2.caratula,
                                    id: asunto2._id,
                                    horas: hours,
                                    gastos: expenses
                                });

                            } else if (asunto2.facturacion.forma_cobro === "flat fee") {

                                var expense = {};

                                expense.total = 0;

                                expense.gastosId = [];

                                horas2.forEach( h => {
                                    
                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                });

                                gastos2.forEach( g => {

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
                                    nombre: asunto2.caratula,
                                    id: asunto2._id,
                                    monto: {
                                        tipo: 'Servicio',
                                        descripcion: asunto2.caratula,
                                        monto: asunto2.facturacion.montogeneral
                                    },
                                    gastos: expense
                                });

                                // Cuando se crea la factura de un flat fee
                                // El monto general (flat fee) se vuelve 0
                                // Si el abogado elimina el borrador o la factura en si, entonces regresa al monto general de antes
                                Asunto.update({_id: asunto3._id}, {
                                    $set: {
                                        'facturacion.montogeneral': 0 
                                    }
                                });

                            } else if (asunto2.facturacion.forma_cobro === "retainer") {
                                var expenses = {};
                                expenses.total = 0;
                                expenses.gastosId = [];
                                gastos2.forEach( g => {
                                    
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
                                    id: asunto2._id,
                                    monto: asunto2.facturacion.retainer.monto + obtenerCostoDeAsuntoRetainer(asunto2._id, asunto2.facturacion.tarifa.id),
                                    gastos: expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                });             
                            }

                            Facturas.insert(factura);

                        break;

                        case 3:

                            let asunto3 = Asuntos.findOne({_id: a.id});

                            let horas3 = Horas.find({'asunto.id': a.id, cobrable: true, facturado: false});
                            let gastos3 = Gastos.find({'asunto.id': a.id, administrativo: false, pagado: false});

                            if (asunto3.facturacion.forma_cobro === "horas hombre") {

                                var hours = {};
                                hours.total = 0;
                                hours.id = [];
                                horas3.forEach( h => {

                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });
                                    
                                    hours.id.push(h._id);

                                    hours.total += getMontoDeHora(h._id, h.responsable.id, asunto3.facturacion.tarifa.id);
                                    
                                });

                                var expenses = {};
                                expenses.total = 0;
                                expenses.gastosId = [];
                                gastos3.forEach( g => {
                                    
                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expenses.gastosId.push(g._id);

                                    expenses.total += g.monto;

                                });

                                factura.asunto.push({
                                    nombre: asunto3.caratula,
                                    id: asunto3._id,
                                    total: hours.total + expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                });                                

                            } else if (asunto3.facturacion.forma_cobro === "flat fee") {
                                
                                var expense = {};
                                expense.total = 0;
                                expense.gastosId = [];

                                horas3.forEach( h => {
                                    
                                    Horas.update({_id: h._id}, {
                                        $set: {
                                            facturado: true
                                        }
                                    });

                                });

                                gastos3.forEach( g => {

                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expense.gastosId.push(g._id);
                                    
                                    expense.total += g.monto;

                                });

                                factura.asunto.push({
                                    nombre: asunto3.caratula,
                                    id: asunto3._id,
                                    total: asunto3.facturacion.montogeneral + expense.total,
                                    descripcion: {
                                        tipo: 'Flat fee y Gastos',
                                        cantidad: 1
                                    }
                                }); 

                                // Cuando se crea la factura de un flat fee
                                // El monto general (flat fee) se vuelve 0
                                // Si el abogado elimina el borrador o la factura en si, entonces regresa al monto general de antes
                                Asunto.update({_id: asunto3._id}, {
                                    $set: {
                                        'facturacion.montogeneral': 0 
                                    }
                                });

                            } else if (asunto3.facturacion.forma_cobro === "retainer") {

                                var expenses = {};
                                expenses.total = 0;
                                expenses.gastosId = [];
                                gastos3.forEach( g => {
                                    
                                    Gastos.update({_id: g._id}, {
                                        $set: {
                                            pagado: true
                                        }
                                    });

                                    expenses.gastosId.push(g._id);

                                    expenses.total += g.monto;

                                });

                                factura.asunto.push({
                                    nombre: asunto3.caratula,
                                    id: asunto3._id,
                                    total: asunto3.facturacion.retainer.monto + obtenerCostoDeAsuntoRetainer(asunto3._id, asunto3.facturacion.tarifa.id) + expenses.total,
                                    descripcion: {
                                        tipo: 'Servicios y Gastos',
                                        cantidad: 1
                                    }
                                });             
                            }

                            Facturas.insert(factura);
                        break;

                    }

                });

                
            }

        } else {
            return;
        }

        
    }
});
