Template.generarCobroFacturaModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    Session.set("asuntosWizard",[])
    Session.set("horasWizard",[])
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
    'click .siguiente-paso'(){

        let currentStep = $(".step").not(".hide");
        let index = $(".step").index(currentStep)

        let currentSepIndicator = $(".indicator.choosed");
        let _index = $(".indicator").index(currentSepIndicator);


        if($(".check-asunto:checked").length!=0){

            if(Session.get("asuntosWizard").length==0){
                let asuntosId = []
                for (var i = 0; i < $(".check-asunto:checked").length; i++) {
                    asuntosId.push($(".check-asunto:checked")[i].value)
                }
                Session.set("asuntosWizard",asuntosId);
            }


            if(Session.get("horasWizard").length==0){
                let horasId = []
                for (var i = 0; i < $(".check-hora").length; i++) {
                    horasId.push($(".check-hora:checked")[i].value)
                }
                Session.set("horasWizard",horasId)
            }

            $(".anterior-paso").removeClass("hide")

            currentSepIndicator.removeClass("paso-seleccionado-color").removeClass("choosed").addClass("completed");
            $($(".indicator")[_index+1]).removeClass("paso-sin-seleccionar").addClass("paso-seleccionado-color").addClass("choosed");

            currentStep.fadeOut("slow",function () {
                $(this).addClass("hide")
            })

            $($(".step")[index+1]).fadeIn("slow",function () {
                $(this).removeClass("hide");
            })
        }
        else {
            Bert.alert('Por favor escoja algun asunto antes de continuar','warning')
        }
    },
    'click .anterior-paso'(){

        let currentStep = $(".step").not(".hide");
        let index = $(".step").index(currentStep)
        if(index==1) $(".anterior-paso").addClass("hide");

        let currentSepIndicator = $(".indicator.choosed");
        let _index = $(".indicator").index(currentSepIndicator);

        currentSepIndicator.removeClass("paso-seleccionado-color").removeClass("choosed").addClass("paso-sin-seleccionar");
        $($(".indicator")[_index-1]).removeClass("paso-sin-seleccionar").addClass("paso-seleccionado-color").addClass("choosed");

        currentStep.fadeOut("slow",function () {
            $(this).addClass("hide")
        })

        $($(".step")[index-1]).fadeIn("slow",function () {
            $(this).removeClass("hide");
        })


    }
});
