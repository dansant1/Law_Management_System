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
    })
})


Template.cobros.onRendered(function () {
})

Template.asuntosxCliente.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    Session.set('clientes',[])
    self.autorun(function () {
        self.subscribe('gastos',bufeteId)
    })
})

Template.botonGenerarFactura.events({
	hide(){
		if(Session.get('clientes').length!=0) return '';
	}
})

Template.asuntosxCliente.events({
    'click [name="mycheckbox"]'(event,template){
        debugger
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


Template.asuntosxCliente.helpers({
    asuntos(){
        return Asuntos.find({'cliente.id':Template.parentData(0)._id,abierto:true});
    },
    gastoMonto(){
        let gastos = Gastos.find({'asunto.id':this._id}).fetch();
        debugger;
        return _(gastos).reduce(function (m,x) {
            return m + x.monto
        },10)
    },
    gastosMontoTotal(){
        let asuntos = Asuntos.find({'cliente.id':this._id}).fetch()

        let totalMontoGasto = 0;
        asuntos.forEach(function (asunto) {
            let gastos = Gastos.find({'asunto.id':asunto._id}).fetch()
            debugger;
            let montoGasto = _(gastos).reduce(function (m,x) {
                return m + x.monto
            },10)

            totalMontoGasto += montoGasto;
        })

        return totalMontoGasto;
    },
    totalMonto(){

        let asuntos = Asuntos.find({'cliente.id':this._id}).fetch();
        let montoTotal = 0;

        asuntos.forEach(function (asunto) {
            let horas = Horas.find({'asunto.id':asunto._id,cobrable:true}).fetch();

            let montoSubtotal = horas.reduce(function (m,x) {
                return m + x.precio;
            },0)

            montoTotal+=montoSubtotal;
        })
        // debugger

        return montoTotal.toFixed(2);
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
            if(tiempoxAsunto[i].minutos>60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }

            totalHoras += tiempoxAsunto[i].horas;
            totalMinutos += tiempoxAsunto[i].minutos;
        }

        if(totalMinutos>60){
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
    }
})
