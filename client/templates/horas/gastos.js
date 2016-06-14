Template.gastos.helpers({
    gastos(){
        return Gastos.find()
    }
})

Template.gastos.onCreated(function () {
    let self=this;

    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('gastos',bufeteId);
    })
})

Template.gastos.events({
    'click .agregar-hora': function (event, template) {
		event.preventDefault();
		Modal.show('agregarHoras');
	},
	'click .agregar-gasto': function (event, template) {
		event.preventDefault();
		Modal.show('agregarGasto');
	}
})
