Template.asuntoForm.onCreated(function () {

	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
		self.subscribe('clientes', bufeteId);
   });

});



Template.asuntoForm.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.asuntoForm.helpers({
	miembros: () => {
		return Meteor.users.find();
	},
	clientes: () => {
		return Clientes.find();
	}
});

Template.asuntoForm.events({
	'submit form': (event, template) => {
		event.preventDefault();

		let asunto = {}

		asunto.cliente = {
			nombre: $( ".cliente option:selected" ).text(),
			id: $( ".cliente" ).val()
		}

		asunto.caratula = template.find( '[name="caratula"]' ).value;
		asunto.carpeta	= template.find( '[name="carpeta"]' ).value;

		asunto.abogados = [];

		$('#integrantes :checked').each(function() {
       		asunto.abogados.push({
       			nombre: $(this).next("label").text(),
       			id: $(this).val()
       		});
     	});


		asunto.area		= $( ".area option:selected" ).text();

		asunto.juzgado	= template.find( '[name="juzgado"]' ).value;
		asunto.observaciones = template.find( '[name="observaciones"]' ).value;
		asunto.inicio	= template.find( '[name="fecha"]' ).value;

		asunto.responsable = {
			nombre: $( ".responsable option:selected" ).text(),
			id: $( ".responsable" ).val()
		}

		asunto.bufeteId = Meteor.user().profile.bufeteId;


		if (asunto.caratula !== "" && asunto.carpeta !== "" && asunto.juzgado !== "" && asunto.inicio !== "")
			return Meteor.call('crearAsunto', asunto, function (err, result) {
				if(err) return Bert.alert('Error al crear el asunto','danger');
				if(result.error) return Bert.alert(result.error,'danger')

				FlowRouter.go('/asuntos/d/' + result.asuntoId);

				template.find( '[name="caratula"]' ).value = "";
				template.find( '[name="carpeta"]' ).value = "";
				template.find( '[name="juzgado"]' ).value = "";
				template.find( '[name="observaciones"]' ).value = "";
				template.find( '[name="fecha"]' ).value = "";
			});

		Bert.alert( 'Ingrese los datos', 'warning' );


	}
});
