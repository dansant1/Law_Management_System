Template.generarCobroFacturaModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    Session.set("asuntosWizard",[])
    Session.set("horasWizard",[])
    Session.set("gastosWizard",[])
    Session.set("cobroWizard",[])
    Session.set("step",0)
    self.autorun(function () {
        self.subscribe('facturas',bufeteId)
        self.subscribe('asuntos',bufeteId)
        self.subscribe('gastos',bufeteId)
        self.subscribe('horas',bufeteId)
    })
});

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
        return _(Horas.find({'asunto.id':{$in:Session.get("asuntosWizard")}}).fetch()).map(function (hora) {
            debugger;
            return {
                id:hora._id,
                responsable:hora.responsable.nombre,
                tiempo : hora.horas + "h " + hora.minutos + "m",
                asunto: Asuntos.findOne({_id:hora.asunto.id}).caratula,
                precio: hora.precio
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
                        debugger
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
        let horas = Horas.find({'asunto.id':this._id,cobrable:true}).fetch();

        return "S/. " +  _(horas).reduce(function (m,x) {
            return m + x.precio
        },0)
    },
    totalGastos(){
        let gastos = Gastos.find({'asunto.id':this._id}).fetch();
        debugger;
        return _(gastos).reduce(function (m,x) {
            return m + x.monto
        }, 0)
    },
    gastosCompletos(){
        return _(Gastos.find({'asunto.id':{$in:Session.get("asuntosWizard")}}).fetch()).map(function (gasto) {
            debugger;
            return {
                id:gasto._id,
                responsable:gasto.responsable.nombre,
                descripcion : gasto.descripcion,
                asunto: Asuntos.findOne({_id:gasto.asunto.id}).caratula,
                precio: gasto.monto
            }
        })
    },
    verificarFormularioActual(){
        debugger;

        if(Session.get("step")){        }


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
    'click .check-asunto'(event,template){
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
        }
    },
    'click .check-hora'(event,template){
        debugger;
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
    'click .check-gasto'(event,template){
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
    'click .siguiente-paso'(){

        // let factura = Facturas.findOne({_id:this._id});

        // if(factura.facturarPor=="honorarios"||factura.facturarPor=="honorariosygastos")
        debugger;
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

        Session.set("step",index+1);

    },
    'click .anterior-paso'(){

        let currentStep = $(".step").not(".hide");
        let index = $(".step").index(currentStep)
        if(index==1) $(".anterior-paso").addClass("hide");

        let currentSepIndicator = $(".indicator.choosed");
        let _index = $(".indicator").index(currentSepIndicator);

        currentSepIndicator.removeClass("paso-seleccionado-color").removeClass("choosed").addClass("paso-sin-seleccionar");
        $($(".indicator")[_index-1]).removeClass("paso-sin-seleccionar").addClass("paso-seleccionado-color").addClass("choosed");

        currentStep.addClass("hide")

        $($(".step")[index-1]).removeClass("hide");

        Session.set("step",index);
    },
    'click .guardar-estado'(){

        let estado = {}

        if(Session.get("asuntosWizard").length!=0) estado.asuntos = Session.get("asuntosWizard");
        if(Session.get("horasWizard").length!=0) estado.horas = Session.get("horasWizard");
        if(Session.get("gastosWizard").length!=0) estado.gastos = Session.get("gastosWizard");
        estado.paso = {}
        estado.paso.nro = Session.get("step");
        estado.paso.nombre = $($(".step")[Session.get("step")]).data("nombre");

        debugger;

        Meteor.call("actualizarEstadoBorrador",estado,this._id,function (err) {
            if(err) return Bert.alert("Error al guardar el estado de la facturar","danger");
            Bert.alert("Se guardo la factura correctamente","success");
        })
    }
});
