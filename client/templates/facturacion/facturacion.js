Template.reportesFacturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.reportesFacturacion.events({
	'click .reporte-asunto': () => {
		Modal.show('reporteAsuntoModal');
	},
	'click .reporte-cliente': () => {
		Modal.show('reporteClienteModal');
	},
	'click .reporte-usuario': () => {
		Modal.show('reporteUsuarioModal');
	},
	'click .reporte-actividad': () => {
		Modal.show('reporteActividadModal');
	},
	'click .reporte-esfuerzo': () => {
		Modal.show('reporteEsfuerzoModal');
	}
});
