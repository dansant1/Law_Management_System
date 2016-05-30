Template.detalleCalendario.onCreated( () => {
	let template = Template.instance();
	let asuntoId = FlowRouter.getParam('asuntoId');
  	template.subscribe( 'eventosxAsunto', asuntoId );
});

Template.detalleCalendario.onRendered(function () {

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

Template.detalleEstados.onCreated(function () {

	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	let asuntoId = FlowRouter.getParam('asuntoId');

    	self.subscribe('estados', bufeteId, asuntoId);
   });

});

Template.finanzasAsunto.events({
	'click .editar': () => {
		Modal.show('editarFacturacionModal');
	}
});

Template.detalleAsunto.onCreated(function () {

	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);
    	self.subscribe('estados', bufeteId, asuntoId);
   });

});

Template.detalleEstados.helpers({
	estados: () => {
    	let result = Estados.find({}, {sort: {createdAt: -1}});
    	return result;
  	}
});

Template.detalleAsunto.helpers({
  	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	dia() {
		var d = this.inicio,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	}
});

Template.datosAsunto.onCreated(function () {
	var self = this;

	self.autorun(function() {

    let asuntoId = FlowRouter.getParam('asuntoId');

    self.subscribe('expediente', asuntoId);
   });
});

Template.datosAsunto.events({
	'click .cerrar': function () {
		swal({  title: "¿Seguro que quieres cerrar este asunto?",
				text: "Este asunto ya no estara disponible para el resto de tu equipo",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, cerrar asunto",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: false
			},
			function() {
				/*let asuntoId = FlowRouter.getParam('asuntoId');
				Meteor.call('cerrarAsunto', asuntoId, function (err) {
					if (err) {
						Bert.alert('Hubo un error, vuelve a intentalo', 'warning');
					} else {
						swal("Asunto cerrado", "El asunto ha sido cerrado correctamente.", "success");
					}

				}); */
				swal("Asunto cerrado", "El asunto ha sido cerrado correctamente.", "success");
			});
	},
	'click .imprimir': function () {

	}
});

Template.menuMain.helpers({
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	}
});

Template.menuFinanzas.helpers({
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	}
});

Template.datosAsunto.helpers({
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	},
	dia(inicio) {
		var d = inicio,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	}
});

Template.menuAsunto.helpers({
	asuntoId: () => {
		return FlowRouter.getParam('asuntoId')
	}
});

Template.mensajes.onCreated(function () {
	var self = this;

	self.autorun(function () {
		let datos = {
			bufeteId: Meteor.user().profile.bufeteId,
			asuntoId: FlowRouter.getParam('asuntoId')
		}

		self.subscribe('mensajesAsunto', datos);

	});

});

Template.mensajes.helpers({
	mensajes: () => {
		let result = MensajesAsunto.find({});
		return result;
	}
});

Template.cajaChat.events({
	'submit form': (event, template) => {
		event.preventDefault();

		let datos = {
			mensaje: template.find('[name="mensaje"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			creador: {
				nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			asuntoId: FlowRouter.getParam('asuntoId')
		}

		if (datos.mensaje !== "") {
			Meteor.call('enviarMensaje', datos, function (err) {
					if (err) {
						Bert.alert('Hubo un problema al enviar, intentalo de nuevo', 'warning');
					} else {
						template.find('[name="mensaje"]').value = "";
					}
			});
		} else {
			Bert.alert('Ingresa el mensaje porfavor', 'warning');
		}

	}
});

Template.TareasAsunto.onCreated(function () {
	var self = this;

	self.autorun(function() {
			let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('tareasxAsunto', asuntoId);
   });
});

Template.TareasAsunto.helpers({
	tareas: function () {
		return Tareas.find();
	},
	dia(inicio) {
		var d = inicio,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	type: (tipo) => {
		if (tipo === "Escritos") {
			return 'amarillo-flat';
		} else if (tipo === "General") {
			return 'rojo-flat';
		} else if (tipo === "Comunicaciones") {
			return 'verde-flat';
		} else if (tipo === "Tribunales") {
			return 'morado-flat';
		} else if (tipo === "Facturacion") {
			return 'naranja-flat';
		}
	}
});
