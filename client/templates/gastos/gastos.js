Template.gastos.helpers({
    gastos(){
        return Gastos.find({administrativo:Session.get('gastos-admin')})
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
    self.autorun(function () {
        self.subscribe('gastos',bufeteId);
        self.subscribe('cambios',bufeteId);
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
    }
})
