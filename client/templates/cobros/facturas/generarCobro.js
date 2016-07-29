Template.generarCobroFacturaModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    Session.set("asuntosWizard",[])
    Session.set("horasWizard",[])
    Session.set("gastosWizard",[])
    Session.set("cobroWizard",[])
    Session.set("step",0)

    let hoy = new Date();
    hoy.setHours(0,0,0,0);
    let mañana = new Date();


    self.autorun(function () {
        self.subscribe('facturas',bufeteId)
        self.subscribe('asuntos',bufeteId)
        self.subscribe('gastos',bufeteId)
        self.subscribe('horas',bufeteId)
        self.subscribe('tarifas',bufeteId)
        self.subscribe('misequipos',bufeteId)
        self.subscribe('cambios',bufeteId);

        let factura = Facturas.findOne({_id:Session.get("factura-id")});
        if(factura.estado){
            if(factura.estado.asuntos)  Session.set("asuntosWizard",factura.estado.asuntos);
            if(factura.estado.horas)    Session.set("horasWizard",factura.estado.horas);
            if(factura.estado.gastos)   Session.set("gastosWizard",factura.estado.gastos);
        }
    })
});

Template.generarCobroFacturaModal.onRendered(function () {
    Session.set('igv',0.18)
    Session.set('cambio-dolar',Cambio.findOne().cambio);
    Session.set('moneda','sol');
    let factura = Facturas.findOne({_id:Session.get("factura-id")});

    if(factura.estado){
        let index = factura.estado.paso.nro;
        Session.set("step",index);
        var pickerCobro = new Pikaday({ field: document.getElementById('datepicker_cobro') });
        if(document.getElementById('datepicker_start')&&document.getElementById('datepicker_end')){
            var picker_start = new Pikaday({ field: document.getElementById('datepicker_start') });
            var picker_end = new Pikaday({field:document.getElementById('datepicker_end')});
        }

        for (var i = 0; i < $(".step").length; i++) {
            if(index==i) $($(".step")[i]).removeClass("hide");
            else $($(".step")[i]).addClass("hide");
        }

        $($(".indicator")[index]).addClass("choosed");

        if(index>0) $(".anterior-paso").removeClass("hide");

        for (var i = 0; i < index; i++) {
            $($(".indicator")[i]).removeClass("paso-seleccionado-color").removeClass("choosed").addClass("completed");
        }

        setTimeout(function () {
            debugger;
            if(factura.estado.asuntos){
                for (var j = 0; j < factura.estado.asuntos.length; j++) {
                    for (var i = 0; i < $(".check-asunto").length; i++) {
                        if($($(".check-asunto")[i]).val()== factura.estado.asuntos[j]) $($(".check-asunto")[i]).attr("checked",true);
                    }
                }
            }

            if(factura.estado.horas){
                for (var j = 0; j < factura.estado.horas.length; j++) {
                    for (var i = 0; i < $(".check-hora").length; i++) {
                        if($($(".check-hora")[i]).val()== factura.estado.horas[j]) $($(".check-hora")[i]).attr("checked",true);
                    }
                }
            }

            if(factura.estado.gastos){
                for (var j = 0; j < factura.estado.gastos.length; j++) {
                    for (var i = 0; i < $(".check-gasto").length; i++) {
                        if($($(".check-gasto")[i]).val()== factura.estado.gastos[j]) $($(".check-gasto")[i]).attr("checked",true);
                    }
                }
            }
        },200)

    }else {
        let horasId = []
        for (var i = 0; i < $(".check-hora").length; i++) {
            $($(".check-hora")[i]).attr("checked",true);
            horasId.push($($(".check-hora")[i]).val())
        }
        Session.set("horasWizard",horasId);
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
        if(convertir) return tarifa;
        if(asunto.facturacion.tipo_moneda=="soles")	return tarifa;
        else return tarifa/Cambio.findOne().cambio;
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
            if(convertir) return tarifa;
            if(asunto.facturacion.tipo_moneda=="soles")	return tarifa;
            else return tarifa/Cambio.findOne().cambio;
		}
	}

	return precio;
}


Template.generarCobroFacturaModal.helpers({
    conHonorarios(){
        let factura = Facturas.findOne({_id:this._id});
        return (factura.facturarPor==="honorariosygastos"||factura.facturarPor==="honorarios");
    },
    conGastos(){
        let factura = Facturas.findOne({_id:this._id});
        return (factura.facturarPor==="honorariosygastos"||factura.facturarPor=="gastos");
    },
    clientes(){
        return Clientes.find({_id:this.cliente.id})
    },
    asuntos(){
        return Asuntos.find({'cliente.id':this.cliente.id,abierto:true});
    },
    horasCompletas(){
        // debugger
        let query;
        if(Session.get("fecha-inicio")&&Session.get("fecha-fin")){

            let inicio = new Date(Session.get("fecha-inicio"))
            inicio.setHours(0,0,0,0);

            let fin = new Date(Session.get("fecha-fin"))
            fin.setHours(0,0,0,0)

            query = {'asunto.id':{$in:Session.get("asuntosWizard")},fecha:{$lte:fin,$gt:inicio}}
        }
        else query = {'asunto.id':{$in:Session.get("asuntosWizard")},}
        // debugger;
        return _(Horas.find(query).fetch().filter(function(hora){
            let asunto = Asuntos.findOne({_id:hora.asunto.id});
            if(asunto.facturacion.forma_cobro=="retainer") return hora.sobrelimite;
            return asunto.facturacion.forma_cobro!="flat fee"
        })).map(function (hora) {
            // debugger;
            let asunto = Asuntos.findOne({_id:hora.asunto.id});
            return {
                id:hora._id,
                responsableNombre:hora.responsable.nombre,
                tiempo : hora.horas + "h " + hora.minutos + "m",
                caratulaAsunto: asunto.caratula,
                precio: hora.precio,
                asunto:{
                    id:asunto._id
                },
                horas:hora.horas,
                minutos:hora.minutos,
                diferencia:hora.diferencia,
                responsable:{
                    id:hora.responsable.id
                },
                sobrelimite:hora.sobrelimite
            }
        })
    },
    horas(){
        var horas = Horas.find({'asunto.id':this._id,cobrable:true}).fetch();

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
                        return m + x.minutos;
                    },0)
                }
        })

        for (var i = 0; i < tiempoxAsunto.length; i++) {

            if(tiempoxAsunto[i].minutos>60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }
        }

        if(tiempoxAsunto.length!=0)
            return _(tiempoxAsunto).map(function (obj) {
                return obj.horas + " h "+ obj.minutos + " m"
            })

        return "0 h 0 m";
    },
    monto(){
        let self = this;
		let asunto = Asuntos.findOne({_id:this._id});
		let total=0;
		let horas = Horas.find({'asunto.id':asunto._id}).fetch();
		if(asunto.facturacion.forma_cobro=="horas hombre"){
			for (var i = 0; i < horas.length; i++) {
				let precio = Number(calcularPorTipoDeCobro(horas[i],false));
				if(precio!=undefined){
					// if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
					// return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
					total += precio;
				}
			}

            if(asunto.facturacion.tipo_moneda=="soles")		return "S/. " + total;
            else return "$ " + total.toFixed(2);
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

            if(asunto.facturacion.tipo_moneda=="soles")	return "S/. " + (total+=Number(asunto.facturacion.retainer.monto)).toFixed(2);
            return "$" + (total+=Number(asunto.facturacion.retainer.monto)).toFixed(2);
		}
        total+= Number(asunto.facturacion.montogeneral);
        if(asunto.facturacion.tipo_moneda=="soles")	return "S/." + total.toFixed(2);
        return "$ " + total.toFixed(2);
    },
    gastos(){
        let asuntosId = Session.get("asuntosWizard");
        let asuntos = Asuntos.find({_id:{$in:asuntosId}})

        let totalMontoGasto = 0;
        asuntos.forEach(function (asunto) {
            let gastos = Gastos.find({'asunto.id':asunto._id}).fetch()
            let montoGasto = _(gastos).reduce(function (m,x) {
                return m + x.monto
            }, 0)

            totalMontoGasto += montoGasto;
        })

        if(Session.get('moneda')=="dolar")  totalMontoGasto = (totalMontoGasto/Session.get('cambio-dolar')).toFixed(2);
        Session.set('totalGastosCobro',totalMontoGasto)

        return totalMontoGasto;
    },
    totalGastos(){
        let gastos = Gastos.find({'asunto.id':this._id}).fetch();
        return _(gastos).reduce(function (m,x) {
            return m + x.monto
        }, 0)
    },
    simbolo_moneda(){
        if(Session.get('moneda')=="dolar") return "$ ";
        return "S/. ";
    },
    gastosCompletos(){
        return _(Gastos.find({'asunto.id':{$in:Session.get("asuntosWizard")}}).fetch()).map(function (gasto) {
            return {
                id:gasto._id,
                responsable:gasto.responsable.nombre,
                descripcion : gasto.descripcion,
                asunto: Asuntos.findOne({_id:gasto.asunto.id}).caratula,
                precio: gasto.monto
            }
        })
    },
    trabajos(){
        debugger;
        let asuntosId = Session.get("asuntosWizard");
        let subtotal = 0;
        let asuntos = Asuntos.find({_id:{$in:asuntosId}})
        let montoTotal = 0;
		asuntos.forEach(function (asunto) {
			// debugger;
			let horas = Horas.find({'asunto.id':asunto._id}).fetch();
			let total=0;
			if(asunto.facturacion.forma_cobro=="horas hombre"){
				for (var i = 0; i < horas.length; i++) {
					let precio = Number(calcularPorTipoDeCobro(horas[i],true));
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
						let precio = Number(calcularPorTipoDeCobro(horas[i],true));
						if(precio!=undefined){
							// if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
							// return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
							total += precio;
						}
					}
				}
				// debugger;
                if(asunto.facturacion.tipo_moneda=="soles")    return montoTotal+=(total+Number(asunto.facturacion.retainer.monto));
    			return montoTotal+= Number(asunto.facturacion.retainer.monto)*Cambio.findOne().cambio;
            }
			if(asunto.facturacion.tipo_moneda=="soles") return montoTotal+= Number(asunto.facturacion.montogeneral);
			return montoTotal+= Number(asunto.facturacion.montogeneral)*Cambio.findOne().cambio;
		})

        if(Session.get('moneda')=="dolar")   montoTotal = (montoTotal/Session.get('cambio-dolar'))
        Session.set('totalMontoTrabajo',montoTotal.toFixed(2))

		return montoTotal.toFixed(2);

    },
    total(){
        let self = this;
        // debugger;
        let precio = calcularPorTipoDeCobro(self);
        if(precio!=undefined){
            if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
            return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
        }
        return;
    },
    verificarFormularioActual(){

        if(Session.get("step")){        }
        // debugger;

        if(Session.get("horasWizard")){
            if ($(".step").not(".hide").hasClass("formulario-horas")) {
                return Session.get("horasWizard").length!=0
            }
        }

        if(Session.get("gastosWizard")){
            if ($(".step").not(".hide").hasClass("formulario-gastos")) {
                return Session.get("gastosWizard").length!=0
            }
        }

        if(Session.get("asuntosWizard")){

            if ($(".step").not(".hide").hasClass("formulario-asuntos")) {
                return Session.get("asuntosWizard").length!=0
            }
        }

        if(Session.get("cobroWizard")){
            if ($(".step").not(".hide").hasClass("formulario-cobro")) {
                return Session.get("cobroWizard").length!=0
            }
        }
    },
    montoTrabajoConIGV(){
        let total = Number(Session.get('totalMontoTrabajo'));
        total+= Session.get('igv')*total;
        return  total.toFixed(2);
    },
    montoGastosConIGV(){
        let total = Number(Session.get('totalGastosCobro'));
        total+= Session.get('igv')*total
        return total.toFixed(2);
    },
    totalgeneral(){

        let totalGastosIGV =   Number(Session.get('totalMontoTrabajo')) + Session.get('igv')*Number(Session.get('totalMontoTrabajo')) ;
        let totalTrabajosIGV = Number(Session.get('totalGastosCobro')) + Session.get('igv')*Number(Session.get('totalGastosCobro'));

        return (totalGastosIGV+totalTrabajosIGV).toFixed(2);
    }
});

Template.generarCobroFacturaModal.events({
    'click .cerrar-modal': () => {
        swal({  title: "¿Segúro que quieres cancelar la emisión de este cobro?",
                text: "Los datos ingresados hasta ahora se perderán",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "Si, cerrar",
                cancelButtonText: "No, cancelar",
                closeOnConfirm: true
            },
            function() {
                Modal.hide('generarCobroFacturaModal');
            });
    },
    'change .fecha-inicio'(event,template){

        Session.set('fecha-inicio',$(event.target).val());
    },
    'change .fecha-fin'(event){
        Session.set("fecha-fin",$(event.target).val())
    },
    'change .check-asunto'(event,template){
        let asuntosWizard = Session.get("asuntosWizard");
        let asuntoId = $(event.target).val();
        if($(event.target).is(":checked")){
            if(asuntosWizard.indexOf(asuntoId)==-1){
                asuntosWizard.push(asuntoId);
                Session.set('asuntosWizard',asuntosWizard)
            }
        }else {
            let i = asuntosWizard.indexOf(asuntoId)
            asuntosWizard.splice(i,1);
            Session.set('asuntosWizard',asuntosWizard)
            Session.set("horasWizard",[])
        }
    },
    'change [name="tipo-moneda"]'(event,template){
        if($(event.target).is(":checked")) return Session.set('moneda','dolar');
        return Session.set('moneda','sol');
    },
    'change .check-hora'(event,template){
        let horasWizard = Session.get("horasWizard");
        let horaId = $(event.target).val();
        if($(event.target).is(":checked")){
            if(horasWizard.indexOf(horaId)==-1){
                horasWizard.push(horaId);
                Session.set('horasWizard',horasWizard)
            }
        }else {
            let i = horasWizard.indexOf(horaId)
            horasWizard.splice(i,1);
            Session.set('horasWizard',horasWizard)
        }
    },
    'change .check-gasto'(event,template){
        let gastosWizard = Session.get("gastosWizard");
        let gastoId = $(event.target).val();
        if($(event.target).is(":checked")){
            if(gastosWizard.indexOf(gastoId)==-1){
                gastosWizard.push(gastoId);
                Session.set('gastosWizard',gastosWizard)
            }
        }else {
            let i = gastosWizard.indexOf(gastoId)
            gastosWizard.splice(i,1);
            Session.set('gastosWizard',gastosWizard)
        }
    },
    'keyup [name="igv-cobro"]'(event,template){
        if(event.target.value=="") return Session.set('igv',0.18);
        return Session.set('igv',event.target.value/100);
    },
    'click .siguiente-paso'(){

        // let factura = Facturas.findOne({_id:this._id});

        // if(factura.facturarPor=="honorarios"||factura.facturarPor=="honorariosygastos")
        let currentStep = $(".step").not(".hide");
        let index = $(".step").index(currentStep)

        let currentSepIndicator = $(".indicator.choosed");
        let _index = $(".indicator").index(currentSepIndicator);


        // if(Session.get("asuntosWizard").length==0){
        //     let asuntosId = []
        //     for (var i = 0; i < $(".check-asunto:checked").length; i++) {
        //         asuntosId.push($(".check-asunto:checked")[i].value)
        //     }
        //     Session.set("asuntosWizard",asuntosId);
        // }


        // if(Session.get("horasWizard").length==0){
        //     let horasId = []
        //     for (var i = 0; i < $(".check-hora").length; i++) {
        //         horasId.push($(".check-hora:checked")[i].value)
        //     }
        //     Session.set("horasWizard",horasId)
        // }

        $(".anterior-paso").removeClass("hide")

        currentSepIndicator.removeClass("paso-seleccionado-color").removeClass("choosed").addClass("completed");
        $($(".indicator")[_index+1]).removeClass("paso-sin-seleccionar").addClass("paso-seleccionado-color").addClass("choosed");

        currentStep.addClass("hide")
        $($(".step")[index+1]).removeClass("hide");

        if(Session.get("horasWizard")!=$(".check-hora").length) {
            let horasId = []

            for (var i = 0; i < $(".check-hora:checked").length; i++) {
                horasId.push($($(".check-hora:checked")[i]).val())
            }

            Session.set("horasWizard",horasId);
        }

        Session.set("step",index+1);

    },
    'click #todas-horas'(event,template){
        let horasId = []
        for (var i = 0; i < $(".check-hora").length; i++) {
            $($(".check-hora")[i]).prop("checked",true);
            horasId.push($($(".check-hora")[i]).val())
        }
        Session.set("horasWizard",horasId);
        $(event.target).attr('id',"ninguna-hora");
        $("#marcador").attr("for","ninguna-hora");

    },
    'click #ninguna-hora'(){
        for (var i = 0; i < $(".check-hora").length; i++) {
            $($(".check-hora")[i]).prop("checked",false);
        }
        Session.set("horasWizard",[])
        $(event.target).attr('id',"todas-horas");
        $("#marcador").attr("for","todas-horas");
    },
    'click .anterior-paso'(){

        let currentStep = $(".step").not(".hide");
        let index = $(".step").index(currentStep)
        if(index==1) $(".anterior-paso").addClass("hide");

        let currentSepIndicator = $(".indicator.choosed");
        let _index = $(".indicator").index(currentSepIndicator);

        currentSepIndicator.removeClass("paso-seleccionado-color").removeClass("choosed").addClass("paso-sin-seleccionar");
        $($(".indicator")[_index-1]).removeClass("paso-sin-seleccionar").addClass("paso-seleccionado-color").addClass("choosed");
        if($($(".indicator")[index-1]).hasClass("completed")) $($(".indicator")[index-1]).removeClass("completed")

        currentStep.addClass("hide")

        $($(".step")[index-1]).removeClass("hide");

        Session.set("step",index-1);
    },
    'click .guardar-estado'(){

        let estado = {}
        // debugger;
        if(Session.get("asuntosWizard").length!=0) estado.asuntos = Session.get("asuntosWizard");
        if(Session.get("horasWizard").length!=0) estado.horas = Session.get("horasWizard");
        if(Session.get("gastosWizard").length!=0) estado.gastos = Session.get("gastosWizard");
        estado.paso = {}
        estado.paso.nro = Session.get("step");
        estado.paso.nombre = $($(".step")[Session.get("step")]).data("nombre");

        Meteor.call("actualizarEstadoBorrador",estado,this._id,function (err) {
            if(err) return Bert.alert("Error al guardar el estado de la facturar","danger");
            Bert.alert("Se guardo la factura correctamente","success");
            Modal.hide("generarCobroFacturaModal");
            Session.set("fecha-inicio",undefined)
            Session.set("fecha-fin",undefined)
            Session.set("asuntosWizard",[])
            Session.set("horasWizard",[])
            Session.set("gastosWizard",[])
            Session.set("cobroWizard",[])
        })
    }
});
