Template.facturarModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId
    self.autorun(function () {
        self.subscribe('clientes',bufeteId)
        self.subscribe('asuntos',bufeteId)

    })
})

Template.facturarModal.onRendered(function () {

})

Template.facturarModal.events({
    'submit form'(event,template){
        event.preventDefault();
        let clientesId = Session.get('clientes');
        if(clientesId.length==0){

        }else {

            let facturas = []

            for (var i = 0; i < clientesId.length; i++) {
                let cliente = Clientes.findOne({_id:clientesId[i]});
                let factura = {}

                factura.cliente = {
                    id: cliente._id,
                    nombre: cliente.nombre + " " + cliente.apellido
                }

                factura.asuntos = []
                let asuntos = Asuntos.find({'cliente.id':cliente._id}).fetch()
                asuntos.forEach(function (asunto) {

                    let data = {
                        id: asunto._id,
                        caratula: asunto.caratula,
                    }

                    data.horas = []
                    data.gastos = []
                    let horas = Horas.find({'asunto.id':asunto._id}).fetch()
                    horas.forEach(function (hora) {
                        data.horas.push({
                            id:hora._id,
                            descripcion:hora.descripcion
                        })
                    })

                    let gastos = Gastos.find({'asunto.id':asunto._id}).fetch();
                    gastos.forEach(function (gasto) {
                        data.gastos.push({
                            id:gasto._id,
                            descripcion:gasto.descripcion
                        })
                    })

                    factura.asuntos.push(data)
                })

            }

            facturas.push(factura)

            Meteor.call('añadirFacturasBorrador',facturas,function (err) {
                if(err) return Bert.alert('No se pudo añadir las facturas','danger')
                Bert.alert('Se agrego correctamente las facturas en borrador','success');
            })
        }
    }
})
