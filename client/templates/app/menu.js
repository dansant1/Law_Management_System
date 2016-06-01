Template.menu.events({
	'click .logout': () => {
		Meteor.logout();
	},

	'click .agregar-tarea': () =>{

	},
	'click .agregar-nota': () =>{

	},
	'click .agregar-evento': () =>{
		Modal.show('evento');
	},
	'click .agregar-cliente': () =>{
		Modal.show('clienteNuevoModal');
	}


});

Template.menu.helpers({
	nombre: function () {
		return Meteor.users.findOne({});
	}
});
