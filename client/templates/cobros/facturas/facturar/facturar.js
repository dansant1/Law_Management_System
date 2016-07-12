Template.facturarModal.onCreated(function () {
    let self = this;
    
    self.autorun(function () {
        let bufeteId = Meteor.user().profile.bufeteId
        self.subscribe('clientes',bufeteId)
        self.subscribe('asuntos',bufeteId)
        self.subscribe('facturas',bufeteId);

    })
})

Template.facturarModal.onRendered(function () {

})

function crearFacturas(clientesId,template) {
    let facturas = []


    for (var i = 0; i < clientesId.length; i++) {
        let cliente = Clientes.findOne({_id:clientesId[i]});
        let factura = {}

        factura.cliente = {
            id: cliente._id,
            nombre: cliente.nombre + " " + cliente.apellido
        }

        factura.facturarPor = template.find("[name='facturarPor']").value


        // factura.asuntos = []
        // let asuntos = Asuntos.find({'cliente.id':cliente._id}).fetch()
        // asuntos.forEach(function (asunto) {
        //
        //     let data = {
        //         id: asunto._id,
        //         caratula: asunto.caratula,
        //     }
        //
        //     data.horas = []
        //     data.gastos = []
        //     let horas = Horas.find({'asunto.id':asunto._id}).fetch()
        //     horas.forEach(function (hora) {
        //         data.horas.push({
        //             id:hora._id,
        //             descripcion:hora.descripcion
        //         })
        //     })
        //
        //     let gastos = Gastos.find({'asunto.id':asunto._id}).fetch();
        //     gastos.forEach(function (gasto) {
        //         data.gastos.push({
        //             id:gasto._id,
        //             descripcion:gasto.descripcion
        //         })
        //     })
        //
        //     factura.asuntos.push(data)
        // })

        facturas.push(factura)
    }


    Meteor.call('añadirFacturasBorrador',facturas,function (err) {
        if (err) {

            return Bert.alert('No se pudo añadir las facturas','danger');
        
        } else {
            Bert.alert('Se agrego correctamente las facturas en borrador','success');
            Modal.hide('facturarModal');    
            FlowRouter.go('/facturacion/cobros/borradores');
        }

        

    })
}

function verificarClientes(ids) {

    let clienteConBorrador=[]
    debugger;

    for (var i = 0; i < ids.length; i++) {

        if(Facturas.find({'cliente.id':ids[i]}).count()>=1){
            let cliente = Clientes.findOne({_id:ids[i]})
            clienteConBorrador.push({
                id: ids[i],
                nombre: cliente.nombreCompleto
            });
        }
    }

    return clienteConBorrador;

}

Template.facturarModal.events({
    'submit form'(event,template){
        event.preventDefault();
        let clientesId = Session.get('clientes');
        let clientesConBorrador = verificarClientes(clientesId);
        if(clientesConBorrador.length==0) crearFacturas(clientesId,template);
        else {
            let mensaje="";
            for (var i = 0; i < clientesConBorrador.length; i++) {
                mensaje+= (i==clientesConBorrador.length-1)? clientesConBorrador[i].nombre : clientesConBorrador[i].nombre + ", " ;
            }

            swal({  title: "¿Segúro que quieres continuar creando los borradores para estos clientes?",
    				text: "Los siguientes clientes poseen borradores: " + mensaje + ", se eliminaran sus borradores anteriores",
    				type: "warning",
    				showCancelButton: true,
    				confirmButtonColor: "#e74c3c",
    				confirmButtonText: "Continuar",
    				cancelButtonText: "Cancelar",
    				closeOnConfirm: true
    			},
    			function() {
    				crearFacturas(clientesId,template);
                    swal("Se crearon los borradores exitosamente");
                    Modal.hide('facturarModal');
    			});
        }

    }
})
