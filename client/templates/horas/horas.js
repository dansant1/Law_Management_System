// Template Horas

Template.listaHoras.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('horas', bufeteId);

   });
});

Template.listaHorasxAsunto.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;
		let asuntoId = FlowRouter.getParam('asuntoId');

    	self.subscribe('horasxAsunto', bufeteId, asuntoId);

   });
});

Template.listaHorasxAsunto.helpers({
	horas: () => {
		return Horas.find({});
	},
	hayhoras: () => {
		if ( Horas.find().fetch().length > 0 ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.horas.events({
    "click #generate-pdf": function (){

	let externalDataRetrievedFromServer = []

	let horas = Horas.find().map(function (i) {
		externalDataRetrievedFromServer.push({"Fecha": i.fecha, "Responsable": i.responsable.nombre,"Descripción": i.descripcion, "Horas": i.horas, "Costo (S/)": i.precio,"Total (S/)": i.total});
	});


	function buildTableBody(data, columns) {
    	var body = [];

    	body.push(columns);

    	data.forEach(function(row) {
        	var dataRow = [];

        	columns.forEach(function(column) {
            	dataRow.push(row[column].toString());
        	})

        	body.push(dataRow);
    	});

    	return body;
	}

		function table(data, columns) {
    		return {
        		table: {
            		headerRows: 1,
            		widths: [90, 100, 100, '*', 75, 75],
            		body: buildTableBody(data, columns)
        		}
    		};
		}

		var dd = {
			pageSize: 'A4',
			pageMargins: [ 30, 25, 30, 25 ],
    		content: [
    				{
						stack: [
							'Susana Valladares Caballero',
							{ text: 'Lima, Perú', style: 'subheader' },
						],
						style: 'header'
					},
    			{
						table: {
								body: [
										['Factura #', '00374'],
										['Fecha de facturación', '08 Mayo, 2016'],
										['Balance total', 'S/ 100'],
										['Asunto', 'Daños y Perjuicios c/ empresa SA']
								]
						}
				},
        		{ text: 'Horas', style: 'header' },
        		table(externalDataRetrievedFromServer, ['Fecha', 'Responsable','Descripción', 'Horas', 'Costo (S/)','Total (S/)']),
        		{ text: '', style: 'header' },
        		{
						table: {
								style: 'header',
								body: [
										['Costo total de horas', '100'],
										['Sub total', '100'],
										['Total', 'S/ 100']
								]
						}
				}
    		],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					alignment: 'right',
					margin: [50,45,0,18]
				},
				subheader: {
					fontSize: 14
				},
				superMargin: {
					margin: [20, 0, 40, 0],
					fontSize: 15,
				}
			}
		}

		// Inicio del proceso de genereacion de pdf
		pdfMake.createPdf(dd).open();

		swal(	"¡Listo!",
  				"Tu factura se generó con exito.",
  				"success");
}});

Template.listaHoras.helpers({
	horas: () => {
		return Horas.find({});
	},
	hayhoras: () => {
		if ( Horas.find().fetch().length > 0 ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.nuevoHoras.events({
	'click a.horas': function (event, template) {
		event.preventDefault();
		Modal.show('agregarHoras');
	},
	'click a.gastos': function (event, template) {
		event.preventDefault();
		Modal.show('agregarGasto');
	}
});

Template.agregarHoras.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.agregarGasto.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.agregarHoras.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
		// self.subscribe('asuntos', bufeteId);
   });
});

Template.agregarHoras.helpers({
	asunto: () => {
		return Asuntos.find({});
	},
	responsable: () => {
		return Meteor.users.find({});
	}
});

Template.agregarHoras.events({
	'submit form': function (event, template) {
		event.preventDefault();

		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			horas: template.find('[name="horas"]').value,
			minutos: template.find('[name="minutos"]').value,
			// precio: template.find('[name="precio"]').value,
			cobrado: $(".cobrado").is(":checked"),
			tarea: $(".es-tarea").is(":checked"),
			creador: {
				id: Meteor.user()._id,
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
			}
		}



		datos.asunto = {
			nombre: $( ".asunto option:selected" ).text(),
			id: $( ".asunto" ).val()
		}

		datos.responsable = {
			nombre: $( ".responsable option:selected" ).text(),
			id: $( ".responsable" ).val()
		}

		if (datos.horas !== "" && datos.asunto !== undefined && datos.fecha !== "" && datos.descripcion !== "") {

			Meteor.call('agregarHora', datos, function (err, result) {
				if (err) {
					console.log(err)
					Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
				} else {
					$('#agregar-modal').modal('hide');
					Bert.alert('Agregaste horas', 'success');
				}
			});

		} else {
			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
		}
	}
});

// Template Gastos

Template.listaGastos.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('gastos', bufeteId);
   });
});

Template.listaGastos.helpers({
	gastos: function () {
		return Gastos.find({});
	}
});

Template.listaGastosxAsunto.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('gastosxAsunto', bufeteId, asuntoId);
   });
});

Template.listaGastosxAsunto.helpers({
	gastos: function () {
		return Gastos.find({});
	},
	haygastos: () => {
		if ( Gastos.find().fetch().length > 0 ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.agregarGasto.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
		// self.subscribe('asuntosx', bufeteId);
   });
});

Template.agregarGasto.helpers({
	asunto: () => {
		return Asuntos.find({});
	},
	responsable: () => {
		return Meteor.users.find({});
	}
});

Template.agregarGasto.events({
	'submit form': function (event, template) {
		event.preventDefault();

		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			monto: template.find('[name="precio"]').value
		}

		datos.asunto = {
			nombre: $( ".asunto option:selected" ).text(),
			id: $( ".asunto" ).val()
		}

		datos.responsable = {
			nombre: $( ".responsable option:selected" ).text(),
			id: $( ".responsable" ).val()
		}

		if (datos.monto !== "" && datos.asunto !== undefined && datos.fecha !== "" && datos.descripcion !== "") {

			Meteor.call('agregarGasto', datos, function (err, result) {
				if (err) {
					Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
				} else {
					$('#gasto-modal').modal('hide');
					Bert.alert('Agregaste un gasto', 'success');
				}
			});

		} else {
			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
		}
	}
});
