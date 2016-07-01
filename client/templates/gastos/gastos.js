Template.gastos.helpers({
    gastos(){
		var query = new RegExp(".*"+Session.get('query')+".*","i");

        let $and = [
            {
                administrativo:Session.get('gastos-admin')
            },
            {
                $or:[
                    {
                        descripcion:query
                    },
                    {
                        'asunto.name':query
                    }
                ]
            }
        ]


        return Gastos.find({$and:$and});
    },
    email() {
      return Meteor.user().emails[0].address
    },
    costo(){
        if(Session.get('tipo-cambio')!="dolares") return "S/ "+ this.monto;
        return "$ " + (this.monto/Cambio.find().fetch()[0].cambio).toFixed(2);
    },
    tipo_gasto(){
        return !Session.get('gastos-admin');
    }
})




Template.gastos.onCreated(function () {
    let self=this;
    let bufeteId = Meteor.user().profile.bufeteId;
    Session.set('gastos-admin',false)
    Session.set('query',"")
    self.autorun(function () {
        self.subscribe('cambios',bufeteId);
        if(Meteor.user().roles.bufete[0]!="administrador")  return self.subscribe('gastosxmiembro',bufeteId);
        self.subscribe('gastos',bufeteId)
    })
})

Template.gastos.events({
    'change .tipo-cambio':function (event,template) {
        return Session.set('tipo-cambio',event.target.value)
    },
    'click .gastos-administrativos'(){
        Session.set('gastos-admin',true)
    },
    'click .gastos-no-administrativos'(){
        Session.set('gastos-admin',false)
    },
    'keyup .buscador-gastos'(event){
        Session.set('query',event.target.value);
    }
})
