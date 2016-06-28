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
	if(Session.get("cronometro-pausado")){
		$("#agregar-horas-modal").find("[name='horas']").val(chronometer.hours);
		$("#agregar-horas-modal").find("[name='minutos']").val(chronometer.minutes);
	}
	Meteor.typeahead.inject();
	var picker = new Pikaday({ field: document.getElementById('datepicker') });

	$('#tarea-typeahead').bind('typeahead:selected', function(obj, datum, name) {
		Session.set("tarea-hora",datum)
	});
});



Template.agregarGasto.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.agregarGastoAdministrativo.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker3') });
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
	},
	tareasHoras(){
		return Tareas.find({horas:{$exists:false}}).fetch().map(function(tarea){ return {id: tarea._id, value: tarea.descripcion}; });
	},
	selected(event, suggestion, datasetName) {
	    // event - the jQuery event object
	    // suggestion - the suggestion object
	    // datasetName - the name of the dataset the suggestion belongs to
	    // TODO your event handler here
	    console.log(suggestion.id);
	}
});

Template.agregarHoras.events({
	'change #tarea-select'(event,template){
		if($(event.target).is(":checked")){
			$(template.find(".descripcion-tarea")).addClass('hide');
			$(template.find(".buscar-tarea")).removeClass('hide')
		}else {
			$(template.find(".descripcion-tarea")).removeClass('hide');
			$(template.find(".buscar-tarea")).addClass('hide')
		}

	},
	'submit form': function (event, template) {
		event.preventDefault();
		debugger;
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			horas: template.find('[name="horas"]').value,
			minutos: template.find('[name="minutos"]').value,
			// precio: template.find('[name="precio"]').value,
			cobrado: $(".cobrado").is(":checked"),
			esTarea: $(".es-tarea").is(":checked"),
			creador: {
				id: Meteor.user()._id,
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
			}
		}

		if($(".es-tarea").is(":checked")) datos.tarea = {
			id: Session.get('tarea-hora').id,
			nombre: Session.get('tarea-hora').value
		}



		datos.asunto = {
			nombre: template.find( ".asunto option:selected" ).innerHTML,
			id: template.find(".asunto").value
		}

		datos.responsable = {
			nombre: $( ".responsable option:selected" ).text(),
			id: $( ".responsable" ).val()
		}

		if (datos.horas !== "" && datos.asunto !== undefined && datos.fecha !== "") {

			Meteor.call('agregarHora', datos, function (err, result) {
				if (err) return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');

				if(Session.get("cronometro-pausado")) chronometer.reset();
				$('#agregar-modal').modal('hide');
				Bert.alert('Agregaste horas', 'success');
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

Template.agregarDescripcionHorasModal.events({
	'click .agregar-descripcion'(event,template){
		event.preventDefault();
		let id = this._id;
		let descripcion = template.find("[name='descripcion']").value
		let datos = {
			id: id,
			descripcion: descripcion
		}

		Meteor.call('actualizarDescripcion',datos,function (err) {
			if(err) return Bert.alert('Hubo un error al actualizar la descripcion','danger')
			Bert.alert('Se actualizo la descripcion correctamente','success')
			Modal.hide('agregarDescripcionHorasModal')
		})

	}
})

Template.agregarAsuntoHorasModal.helpers({
	asunto(){
		return Asuntos.find();
	}
})

Template.agregarAsuntoHorasModal.events({
	'click .agregar-asunto'(event,template){
		event.preventDefault();
		var data = {}
		let id = this._id;
		let asunto = {
			id: template.find(".asunto").value,
			nombre: template.find(".asunto :selected").innerHTML
		}

		data.id = id;
		data.asunto = asunto;

		Meteor.call('actualizarAsunto',data,function (err) {
			if(err) return Bert.alert('Hubo un error al actualizar el asunto','danger')
			Bert.alert('Se actualizo el asunto correctamente','success')
			Modal.hide('agregarAsuntoHorasModal')
		})
	}
})

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

Template.agregarGastoAdministrativo.events({
	'submit form': function (event,template) {
		event.preventDefault();

		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			monto: template.find('[name="precio"]').value
		}

		if (datos.monto !== "" && datos.fecha !== "" && datos.descripcion !== "") {

			Meteor.call('agregarGastoAdministrativo', datos, function (err, result) {
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
})

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
