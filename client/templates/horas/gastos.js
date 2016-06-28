Template.gastos.helpers({
    gastos(){
        return Gastos.find()
    },
    email() {
      return Meteor.user().emails[0].address
    },
    costo(){
        if(Session.get('tipo-cambio')!="dolares") return "S/."+ this.monto;
        return "$ " + (this.monto/Cambio.find().fetch()[0].cambio).toFixed(2);

    }
})

Template.gastos.onCreated(function () {
    let self=this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('gastos',bufeteId);
        self.subscribe('cambios',bufeteId);
    })
})

Template.gastos.events({
    'change .tipo-cambio':function (event,template) {
        return Session.set('tipo-cambio',event.target.value)
    },
    'click .agregar-hora': function (event, template) {
		event.preventDefault();
		Modal.show('agregarHoras');
	},
	'click .agregar-gasto': function (event, template) {
		event.preventDefault();
		Modal.show('agregarGasto');
	}
})
