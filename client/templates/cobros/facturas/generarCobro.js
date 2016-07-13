Template.generarCobroFacturaModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('facturas',bufeteId)
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
    monto(){

    },
    monto(){

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
    }
});
