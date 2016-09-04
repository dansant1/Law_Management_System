Template.cobros.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.listaClientesFacturables.helpers({
    clientes(){
        var query = new RegExp(".*"+Session.get('query')+".*","i");

        let clientesId = _(Asuntos.find({'caratula':query}).fetch()).map(function (asunto) {
            return asunto.cliente.id;
        })

        let $and = [
            {estatus:'cliente'},
            {
                $or : [
                    {
                        nombreCompleto:query
                    },
                    {
                        _id:{
                            $in: clientesId
                        }
                    }
                ]
            }
        ]


        return Clientes.find({$and:$and});
    }
})

Template.cobros.events({
	'click .generar-cobros': function () {
		Modal.show('generarCobroModal');
	},
    'click .boton-facturar':function () {
        Modal.show('facturarModal')
    },
    'keyup .buscador-cobros':function (event,target) {
        Session.set('query',event.target.value);
    }
});

Template.cobros.onCreated(function () {
    let self = this;
    Session.set('query',"")
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('clientes',bufeteId);
        self.subscribe('asuntos',bufeteId);
        self.subscribe('horas',bufeteId);
        self.subscribe('cobros',bufeteId);
        self.subscribe('gastos',bufeteId)
		self.subscribe('cambio',bufeteId);
    })
})


Template.cobros.onRendered(function () {})

Template.asuntosxCliente.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    Session.set('clientes',[])
    self.autorun(function () {
        self.subscribe('gastos',bufeteId)
		self.subscribe('horas',bufeteId)
		self.subscribe('tarifas',bufeteId)
    })
})

Template.botonGenerarFactura.helpers({
	hide(){
		if(Session.get('clientes')!=undefined)
			if(Session.get('clientes').length!=0) return '';
			else return 'hide'
	}
})

Template.asuntosxCliente.events({
    'click [name="mycheckbox"]'(event,template){
        let clienteId = $(event.target).attr('id');
        let clientesId = Session.get('clientes')
        if($(event.target).is(":checked")){
            if(clientesId.indexOf(clienteId)==-1){
                clientesId.push(clienteId);
                Session.set('clientes',clientesId)
            }
        }else {
            let i =clientesId.indexOf(clienteId)
            clientesId.splice(i,1);
            Session.set('clientes',clientesId);
        }
    }
})


function totalHorasAcumuladas(asuntoId) {

	var horas = Horas.find({'asunto.id':asuntoId,cobrable:true}).fetch();
	var asunto = Asuntos.findOne({_id:asuntoId});
	var grupos = _(horas).groupBy(function (hora) {
		return hora.asunto.id;
	})
	// debugger;
	var tiempoxAsunto = _(grupos).map(function (g,key) {
		return {
				type:key,
				horas: _(g).reduce(function (m,x) {
					return m + x.horas;
				},0),
				minutos: _(g).reduce(function (m,x) {
					debugger
					return m + x.minutos;
				},0)
			}
	})

	for (var i = 0; i < tiempoxAsunto.length; i++) {

		if(tiempoxAsunto[i].minutos>=60){
			let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
			tiempoxAsunto[i].horas += horas;
			tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
		}
	}

	if(tiempoxAsunto[0])  return tiempoxAsunto[0].horas;
	return 0;
}


function calcularTarifa(trabajo) {
	let asunto = Asuntos.findOne({_id:trabajo.asunto.id}),
		tarifa = Tarifas.findOne({_id:asunto.facturacion.tarifa.id}),
		cambio = Cambio.findOne({bufeteId:trabajo.bufeteId}),
		precio;



	tarifa.miembros.some(function (miembro) {
		if(miembro.id==trabajo.responsable.id){
			let costoxminuto, costoxhora;

			if(trabajo.diferencia)	costoxhora = miembro.soles*trabajo.diferencia;
			else costoxhora = miembro.soles*trabajo.horas;

			costoxminuto = (miembro.soles/60)*trabajo.minutos;

			return precio = Number(costoxhora) + Number(costoxminuto);
		}
	})

	if(!precio){
		let user = Meteor.users.findOne({_id:trabajo.responsable.id});
		tarifa.roles.some(function (roles) {
			let costoxminuto, costoxhora;
			if(user.roles.bufete.length==1)
				if(user.roles.bufete[0]==roles.nombre){

					if(trabajo.diferencia)	costoxhora = miembro.soles*trabajo.diferencia;
					else costoxhora = miembro.soles*trabajo.horas;
					costoxminuto = (roles.soles/60)*trabajo.minutos;

					return precio = Number(costoxhora) + Number(costoxminuto);

				}
			else {
				if(user.roles.bufete[1]==roles.nombre){
					if(trabajo.diferencia)	costoxhora = miembro.soles*trabajo.diferencia;
					else costoxhora = miembro.soles*trabajo.horas;

					costoxminuto = (roles.soles/60)*trabajo.minutos;
					return precio =  Number(costoxhora) + Number(costoxminuto);
				}
			}
		})
	}

	return precio;

}

function calcularPorTipoDeCobro(trabajo,convertir) {
	let precio,
		asunto = Asuntos.findOne({_id:trabajo.asunto.id})
	if(asunto.facturacion.forma_cobro=="horas hombre") {
		let tarifa = calcularTarifa(trabajo).toFixed(2);

		if(!convertir) return tarifa;

		if(asunto.facturacion.tipo_moneda=="soles")	return tarifa;
		return tarifa/Cambio.findOne().cambio;
	}
	if(asunto.forma_cobro=="flat fee") return "";

	if(asunto.facturacion.forma_cobro=="retainer"){

			// if(!asunto.facturacion.excedido){
			// 	let diferencia = totalHorasAcumuladas(datos.asuntos.id) - asunto.facturacion.retainer.horas_maxima;
			// 	datos.horas = diferencia;
			// 	Asuntos.update({_id:datos.asunto.id},{
			// 		$set:{
			// 			'facturacion.excedido':true
			// 		}
			// 	})
			// }
			//
			// console.log('ENTRO AQUI');
		if(trabajo.sobrelimite){
			let tarifa = calcularTarifa(trabajo).toFixed(2)
			if(!convertir) return tarifa;

			if(asunto.facturacion.tipo_moneda=="soles")	return tarifa;
			return tarifa/Cambio.findOne().cambio;
		}
		return tarifa;
	}

	return precio;
}

Template.asuntosxCliente.helpers({
    asuntos(){
        return Asuntos.find({'cliente.id':Template.parentData(0)._id,abierto:true});
    },
    gastoMonto(){
        let gastos = Gastos.find({'asunto.id':this._id}).fetch();
        return _(gastos).reduce(function (m,x) {
            return m + x.monto
        }, 0)
    },
    gastosMontoTotal(){
        let asuntos = Asuntos.find({'cliente.id':this._id}).fetch()

        let totalMontoGasto = 0;
        asuntos.forEach(function (asunto) {
            let gastos = Gastos.find({'asunto.id':asunto._id}).fetch()
            let montoGasto = _(gastos).reduce(function (m,x) {
                return m + x.monto
            }, 0)

            totalMontoGasto += montoGasto;
        })

        return totalMontoGasto;
    },
    totalMonto(){

        let asuntos = Asuntos.find({'cliente.id':this._id}).fetch();
		let montoTotal = 0;
		//debugger;
		asuntos.forEach(function (asunto) {
			// debugger;
			let horas = Horas.find({'asunto.id':asunto._id}).fetch();
			let total=0;
			if(asunto.facturacion.forma_cobro=="horas hombre"){
				for (var i = 0; i < horas.length; i++) {
					let precio = Number(calcularPorTipoDeCobro(horas[i],false));
					if(precio!=undefined){
						// if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
						// return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
						total += precio;
					}
				}
				return montoTotal+=total;
			}
			if(asunto.facturacion.forma_cobro=="retainer"){
				for (var i = 0; i < horas.length; i++) {
					if(horas[i].sobrelimite){
						let precio = Number(calcularPorTipoDeCobro(horas[i],false));
						if(precio!=undefined){
							// if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
							// return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
							total += precio;
						}
					}
				}
				// debugger;
				// if(!)

				if(asunto.facturacion.tipo_moneda=="soles") return montoTotal+=(total+(Number(asunto.facturacion.retainer.monto)));
				return montoTotal+=(total+(Number(asunto.facturacion.retainer.monto)*Cambio.findOne().cambio));
			}
			// debugger;
			if(asunto.facturacion.tipo_moneda=="soles") return montoTotal+= Number(asunto.facturacion.montogeneral);
			return montoTotal+= Number(asunto.facturacion.montogeneral)*Cambio.findOne().cambio;
		})

		// debugger;

		return montoTotal.toFixed(2);

		// return "S/. " + total;
		//
        // asuntos.forEach(function (asunto) {
		//
		// 	let horas = Horas.find({'asunto.id':asunto._id,cobrable:true,precio:{$exists:true}}).fetch();
		// 	if(asunto.facturacion.forma_cobro=="horas hombre"){
		//
	    //         // let horas = Horas.find({'asunto.id':asunto._id,cobrable:true}).fetch();
		//
	    //         let montoSubtotal = horas.reduce(function (m,x) {
	    //             return m + x.precio;
	    //         },0)
		//
	    //         montoTotal+=montoSubtotal;
		// 	}
		//
		// 	if(asunto.facturacion.forma_cobro=="flat fee"){
		// 		montoTotal+=Number(asunto.facturacion.montogeneral)
		// 	}
		//
		// 	if(asunto.facturacion.forma_cobro=="retainer"){
		// 		// let horas = Horas.find({'asunto.id':asunto._id,cobrable:true,precio:{$exists:true}}).fetch();
		// 		let subtotal = Number(asunto.facturacion.retainer.monto);
		// 		debugger;
		// 		if(horas){
		// 			if(horas.length!=0){
		// 				subtotal += horas.reduce(function (m,x) {
		// 					return m + x.precio;
		// 				},0)
		// 			}
		// 		}
		//
	    //         montoTotal+=subtotal;
		// 	}
        // })
        // // debugger
        // return montoTotal.toFixed(2);
    },
    totalHoras(){

        let asuntosId = _(Asuntos.find({'cliente.id':this._id}).fetch()).map(function (asunto) {
            return asunto._id;
        })
        // debugger
        var horas = Horas.find({'asunto.id':{$in:asuntosId},cobrable:true}).fetch();

        var groups = _(horas).groupBy(function (hora) {
            return hora.asunto.id;
        })

        var tiempoxAsunto = _(groups).map(function (g,key) {
            return {
                    id:key,
                    horas: _(g).reduce(function (m,x) {
                        return m + x.horas;
                    },0),
                    minutos: _(g).reduce(function (m,x) {
                        return m + x.minutos
                    },0)
                }
        })

        let totalHoras = 0;
        let totalMinutos = 0;

        for (var i = 0; i < tiempoxAsunto.length; i++) {
            if(tiempoxAsunto[i].minutos>=60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }

            totalHoras += tiempoxAsunto[i].horas;
            totalMinutos += tiempoxAsunto[i].minutos;
        }

        if(totalMinutos>=60){
            totalHoras += Number(String(totalMinutos/60).split(".")[0]);;
            totalMinutos += totalMinutos%60;
        }

        return totalHoras + "h " + totalMinutos +"m " ;
    },
    horas(){
        var horas = Horas.find({'asunto.id':this._id,cobrable:true}).fetch();

        var grupos = _(horas).groupBy(function (hora) {
            return hora.asunto.id;
        })

        var tiempoxAsunto = _(grupos).map(function (g,key) {
            return {
                    type:key,
                    horas: _(g).reduce(function (m,x) {
                        return m + x.horas;
                    },0),
                    minutos: _(g).reduce(function (m,x) {
                        return m + x.minutos;
                    },0)
                }
        })

        for (var i = 0; i < tiempoxAsunto.length; i++) {

            if(tiempoxAsunto[i].minutos>=60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }
        }

        if(tiempoxAsunto.length!=0)
            return _(tiempoxAsunto).map(function (obj) {
                return obj.horas + "h "+ obj.minutos + "m"
            })

        return "0h 0m";


    },
    monto(){

		let self = this;
		let asunto = Asuntos.findOne({_id:this._id});
		let total=0;
		let horas = Horas.find({'asunto.id':asunto._id}).fetch();
		// if(asunto.caratula=="ASUNTO 2") debugger;
		if(asunto.facturacion.forma_cobro=="horas hombre"){
			for (var i = 0; i < horas.length; i++) {
				let precio = Number(calcularPorTipoDeCobro(horas[i],false));
				if(precio!=undefined){
					// if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
					// return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
					total += precio;
				}
			}
			return "S/. " + total.toFixed(2);
		}
		if(asunto.facturacion.forma_cobro=="retainer"){
			// debugger;
			for (var i = 0; i < horas.length; i++) {
				if(horas[i].sobrelimite){
					let precio = Number(calcularPorTipoDeCobro(horas[i],false));
					if(precio!=undefined){
						// if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
						// return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
						total += precio;
					}
				}
			}
			if(asunto.facturacion.tipo_moneda=="soles") return "S/. " + (total+=Number(asunto.facturacion.retainer.monto)).toFixed(2);
			return "S/. " + (total+=Number(asunto.facturacion.retainer.monto)*Cambio.findOne().cambio).toFixed(2);
		}
		if(asunto.facturacion.tipo_moneda=="soles") return "S/. " + (total+= Number(asunto.facturacion.montogeneral)).toFixed(2);
		return "S/. " + (total+= Number(asunto.facturacion.montogeneral)*Cambio.findOne().cambio).toFixed(2);
    }
})
