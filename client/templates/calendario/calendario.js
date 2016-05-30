Template.calendario.onCreated( () => {
	let template = Template.instance();
  	template.subscribe( 'eventos' );
});

Template.calendario.events({
	'click .evento': () => {
		Modal.show('evento');
	}
});


Template.calendario.onRendered( () => {

  	$( '#calendario' ).fullCalendar({
    	events( start, end, timezone, callback ) {

    			let data = Eventos.find().fetch().map( ( event ) => {
        		return event;
      		});

      		if ( data ) {
        		callback( data );
      		}
    	},
    	lang: 'es',
			header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
    	defaultView: 'agendaWeek'
  	});

  	Tracker.autorun( () => {

    	Eventos.find().fetch();

    	$( '#calendario' ).fullCalendar( 'refetchEvents' );

  	});

});

Template.evento.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntos', bufeteId);
   });
});

Template.evento.helpers({
	asuntos: function () {
		return Asuntos.find();
	}
});

Template.evento.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
	var picker2 = new Pikaday({ field: document.getElementById('datepicker2') });

});

Template.evento.events({
	'submit form': function (event, template) {
		event.preventDefault();
		let datos = {}

		datos.asunto = {
			nombre: $( ".asunto option:selected" ).text(),
			id: $( ".asunto  option:selected" ).val()
		};

		if (datos.asunto.nombre === "Elige un asunto") {
			datos.asunto.nombre = "Sin asunto";
		}

		let horai = template.find('[name="horai"]').value;
		let minutoi = template.find('[name="minutoi"]').value;

		if (horai === "") {
			horai = "00";
		}

		if (minutoi === "") {
			minutoi = "00";
		}

		switch (horai) {
			case "1": 
				horai = "01";
				break;
			case "2":
				horai = "02";
				break;
			case "3":
				horai = "03";
				break;
			case "4": 
				horai = "04";
				break;
			case "5": 
				horai = "05";
				break;
			case "6": 
				horai = "06";
				break;
			case "7": 
				horai = "07";
				break;
			case "8": 
				horai = "08";
				break;
			case "9": 
				horai = "09";
				break;		
		}

		datos.start = template.find('[name="inicio"]').value + "T" + horai + ":" + minutoi + ":00";


		let horaf = template.find('[name="horaf"]').value;
		let minutof = template.find('[name="minutof"]').value;

		switch (horaf) {
			case "1": 
				horai = "01";
				break;
			case "2":
				horai = "02";
				break;
			case "3":
				horai = "03";
				break;
			case "4": 
				horai = "04";
				break;
			case "5": 
				horai = "05";
				break;
			case "6": 
				horai = "06";
				break;
			case "7": 
				horai = "07";
				break;
			case "8": 
				horai = "08";
				break;
			case "9": 
				horai = "09";
				break;		
		}

		if (horaf === "") {
			horaf = "00";
		}

		if (minutof === "") {
			minutof = "00";
		}

		datos.end = template.find('[name="fin"]').value + "T" + horaf + ":" + minutof + ":00";

		datos.bufeteId = Meteor.user().profile.bufeteId;

		datos.creador = {
			nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
			id: Meteor.userId()
		}

		datos.title = template.find('[name="descripcion"]').value + " - Asunto: " + datos.asunto.nombre + " - Asignado a " + datos.creador.nombre;

		if (datos.title !== "" && datos.start !== "T00:00:00" &&  datos.end !== "T00:00:00")  {
			Meteor.call('crearEvento', datos, function (err, result) {
				if (err) {
					template.find('[name="fin"]').value = "";
					template.find('[name="horaf"]').value = "";
					template.find('[name="minutof"]').value = "";
					template.find('[name="inicio"]').value = "";
					template.find('[name="horai"]').value = "";
					template.find('[name="minutoi"]').value = "";
					Bert.alert('algo salio mal, vuelve a intentarlo', 'warning');
				} else {
					template.find('[name="fin"]').value = "";
					template.find('[name="horaf"]').value = "";
					template.find('[name="minutof"]').value = "";
					template.find('[name="inicio"]').value = "";
					template.find('[name="horai"]').value = "";
					template.find('[name="minutoi"]').value = "";
					$('#cal-modal').modal('hide');
					Bert.alert('agregaste un nuevo evento', 'success');

				}
			});
		} else {
			Bert.alert('Ingresa los datos', 'warning');
		}
	}
});
