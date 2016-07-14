Template.empecemos.events({
	'click .iniciar': () => {
		FlowRouter.go('/bienvenido/yo');
	}
});

Template.configuracionPerfilInicial.events({
	'click .continuar-paso2': () => {
		FlowRouter.go('/bienvenido/mi-firma');
	}
});

Template.configuracionFirmaInicial.events({
	'click .listo': () => {
		
	}
});