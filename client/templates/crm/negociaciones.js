Template.listaNegociacionesCRM.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('casos2', bufeteId);
   });
});

Template.listaNegociacionesCRM.helpers({
	casos() {
		return Casos.find({}, {sort: {createdAt: -1}});
	},
	color: function () {
		if (this.estatus === "abierto") {
			return "morado-flat"
		} else if (this.estatus === "cerrado") {
			return "green"
		} else {
			return "rojo-flat"
		}
	}
});

Template.listaNegociacionesCRM.events({
	'click .eliminar-caso': function () {
		Meteor.call('eliminarCaso', this._id, function (err) {
			if (err) {
				Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
			} else {
				Bert.alert('Eliminaste la negociación', 'success');
			}
		});
	}
});