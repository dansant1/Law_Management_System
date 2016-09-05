

Template.menu.onCreated( function () {
	var self = this;

	this.limite = new ReactiveVar(7);


	self.autorun(function () {

		let bufeteId = Meteor.user().profile.bufeteId;
		self.subscribe('news', bufeteId, self.limite.get());

	});
});

Template.menu.onRendered(function () {
	Session.set('abrir', 'open-menu');
	Session.set('close', '');
	Session.set('cerrar-news', 'sidebar-derecho-close');

	Template.instance().tour = new Tour({
  		steps: [
  			{
    			element: "#tour-1",
    			title: "Dashboard",
    			content: "Observe las metricas y la actividad de su firma desde el Dashboard"
  			},
  			{
    			element: "#tour-2",
    			title: "Tu equipo",
    			content: "Agrega a los miembros del estudio haciendo click en +"
  			},
  			{
    			element: "#tour-3",
    			title: "Conversaciones",
    			content: "Iniciar una conversación grupal de cualquier tema"
  			},
  			{
    			element: "#tour-4",
    			title: "Tu agenda mas efectiva",
    			content: "Gestiona tu agenda con nustro calendario personal. Para crear un nuevo evento haz click en +"
  			},
  			{
    			element: "#tour-5",
    			title: "Tus tareas en un solo lugar",
    			content: "Gestiona tus tareas desde aquí. edita los deadlines, asignalo a algún miembro de tu equipo y/o enlzalo con un asunto y horas de trabajo. "
  			},
  			{
    			element: "#tour-6",
    			title: "Organiza tus asuntos",
    			content: "Crea y administra tus proyectos, casos, asuntos. Haz click en + para crear tu primer asunto."
  			},
  			{
    			element: "#tour-7",
    			title: "Gestiona a tus clientes",
    			content: "Desde nuestro CRM puedes dar seguimientos a tus clientes, agregar notas relacionadas, crear negociaciones y ver reportes. Haz click en + para agregar un nuevo contacto."
  			},
  			{
    			element: "#tour-8",
    			title: "Lleva el control de tu facturación",
    			content: "Lleva el control de tus horas de trabajo, gastos y metricas de tu firma."
  			}
		],
		keyboard: true,
	});

	Template.instance().tour.init();

	$(".rippler").rippler({
    effectClass      :  'rippler-effect'
    ,effectSize      :  16      // Default size (width & height)
    ,addElement      :  'div'   // e.g. 'svg'(feature)
    ,duration        :  400
  });
});

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " años";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " meses";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " dias";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " horas";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutos";
    }
    return Math.floor(seconds) + " segundos";
}

Template.menu.helpers({
	tieneAcceso() {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) || Roles.userIsInRole( Meteor.userId(), ['encargado comercial'], 'bufete' ) || Roles.userIsInRole( Meteor.userId(), ['socio'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	},
	cerrar() {
		return Session.get('cerrar-news');
	},
	news: () => {
		return NewsFeed.find({}, {sort: {createdAt: -1} });
	},
	haynews: () => {
		if ( NewsFeed.find().fetch().length > 10 ) {
			return true;
		} else {
			return false;
		}
	},
	type: (tipo) => {
		if (tipo === "Expediente") {
			return 'amarillo-flat-b';
		} else if (tipo === "Documentos") {
			return 'rojo-flat-b';
		} else if (tipo === "Evento") {
			return 'verde-flat-b';
		} else if (tipo === "Hito") {
			return 'morado-flat-b';
		} else if (tipo === "Tarea") {
			return 'azul-flat-b';
		} else if (tipo === "Cliente") {
			return 'naranja-flat-b';
		} else if (tipo === "Estado") {
			return 'turquesa-flat-b';
		} else {
			return 'azul-empresa-b'
		}
	},
	sucedio(createdAt) {

		return timeSince(createdAt);
	},
	quien() {
		if (this.creador.id === Meteor.userId()) {
			return 'Tú';
		} else {
			return this.creador.nombre;
		}
	}
});

Template.menu.events({
	'click .logout': () => {
		Meteor.logout();
		window.Intercom("shutdown");
	},
	'click .agregar-tarea'() {
		Modal.show('nuevaTareaModal2')
	},
	'click .agregar-nota'() {
		Modal.show('notaxasuntosModal')
	},
	'click .agregar-evento'() {
		Modal.show('evento');
	},
	'click .agregar-cliente'() {
		Modal.show('clienteNuevoModal');
	},
	'click .asunto-modal'() {
		Modal.show('asuntoNuevoModal');
	},
	'click .modal-cliente'() {
		Modal.show('ModalClienteNuevo2');
	},
	'click .workflow-modal'() {
		Modal.show('workflowModal');
	},
	'click .hora-modal'() {
		Modal.show('agregarHoras');
	},
	'click .tarifa-modal'() {
		Modal.show('crearTarifaModal');
	},
	'click .abrir-menu'() {
		if (Session.get('abrir') === "open-menu" && Session.get('close') === "") {
			Session.set('abrir', 'close-menu');
			Session.set('close', 'sidebar-close');
		} else {
			Session.set('abrir', 'open-menu');
			Session.set('close', '');
		}

	},
	'click .iniciar-tour'() {
		Template.instance().tour.start();
	},
	'click .abrir-news'() {
		if (Session.get('cerrar-news') === "") {
			Session.set('cerrar-news', 'sidebar-derecho-close');
		} else {
			Session.set('cerrar-news', '');
		}
	},
	'click .cargar'(event, template) {
		let cargar = template.limite.get() + 10;
		template.limite.set(cargar);

	}
});

Template.notaxasuntosModal.helpers({
	asuntos (){
		return Asuntos.find({});
	}
});

Template.notaxasuntosModal.onRendered(function(){
	var picker = new Pikaday({ field: document.getElementById('datepicker3') });
});

Template.notaxasuntosModal.events({
	'submit form' : function (event,template) {

		event.preventDefault();
		//debugger;
		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			creadorId: Meteor.userId(),
			bufeteId: Meteor.user().profile.bufeteId,
			asuntoId: template.find('[name="asuntoId"]').value,
			fecha: template.find('[name="fecha"]').value
		}

		if (datos.nombre !== "") {
			Meteor.call('agregarNota', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					//Bert.alert('Agregaste una nueva nota', 'success');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
					template.find('[name="fecha"]').value = "";
					$('#nota-modal').modal('hide');
					swal("Agregaste una nueva nota");
				}
			});
		} else {
			Bert.alert('Agrega los datos correctamente', 'warning');
		}
	}
})

Template.menu.helpers({
	nombre: function () {
		return Meteor.users.findOne({});
	}
});

Template.cronometro2.onRendered(function () {
	if(localStorage.startCr=="1"){

		chronometer.seconds = Number(localStorage.seconds)
		chronometer.minutes = Number(localStorage.minutes)
		chronometer.hours = Number(localStorage.hours)
		chronometer.element = ".hora-crono";

		if(localStorage.pause!="0")	{
			$(".boton-play").find("i").removeClass("glyphicon-play").addClass("glyphicon-pause");
			$(".boton-play").removeClass("boton-play").addClass("boton-stop")
			chronometer.timer();
		}


		$(".hora-crono")[0].textContent = (chronometer.hours ? (chronometer.hours > 9 ? chronometer.hours : "0" + chronometer.hours + "h") : "00") + "h " + (chronometer.minutes ? (chronometer.minutes > 9 ? chronometer.minutes + "m" : "0" + chronometer.minutes + "m") : "00m");


	}

})


Template.cronometro2.events({
	'click .boton-play'(){
		$(".boton-play").find("i").removeClass("glyphicon-play").addClass("glyphicon-pause");
		$(".boton-play").removeClass("boton-play").addClass("boton-stop")
		chronometer.element = ".hora-crono";
		chronometer.timer();
		Session.set("cronometro-pausado",false);


	},
	'click .boton-stop'(){
		$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
		$(".boton-stop").removeClass("boton-stop").addClass("boton-play")
		chronometer.stop();
		Session.set("cronometro-pausado",true);

	},

	'click .boton-resetear'(){
		swal({  title: "¿Segúro que quieres resetear el cronómetro?",
				text: "El tiempo transcurrido ya no estara disponible",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, resetear",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: true
			},
			function() {
				chronometer.reset();
				if(!$(".boton-principal").hasClass("boton-play")){
					$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
					return $(".boton-stop").removeClass("boton-stop").addClass("boton-play")
				}
				swal("Horas eliminadas", "El cronometro se reinicio correctamente", "success");
			});

	},
	'click .boton-disminuir'(){
		chronometer.removeMinutes(5)
	},
	'click .boton-aumentar'(){
		chronometer.addMinutes(5)
	},
	'click .boton-agregar-hora'(){
		$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
		$(".boton-stop").removeClass("boton-stop").addClass("boton-play")
		chronometer.stop();
		Session.set("cronometro-pausado",true);

		Modal.show('agregarHoras');

	},
	'click .boton-guardar-hora'(){

		if(localStorage.startCr=="1"){
			var datos = {
				bufeteId : Meteor.user().profile.bufeteId,
				horas: chronometer.hours+"",
				minutos: chronometer.minutes+"",
				fecha: new Date(),
				creador: {
					id: Meteor.user()._id,
					nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
				},
				responsable:{
					id: Meteor.user()._id,
					nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
				}
			}

			return Meteor.call('agregarHoraSinDetalles',datos,function (err) {
				//debugger;
				if(err) return Bert.alert('Error al momento de crear las horas','danger');
				chronometer.reset();
				if(!$(".boton-principal").hasClass("boton-play")){
					$(".boton-stop").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
					$(".boton-stop").removeClass("boton-stop").addClass("boton-play")
				}

				Bert.alert('Se creo las horas correctamente','success');
				FlowRouter.go('/facturacion/horas')
			})
		}

		Bert.alert('Inicie el cronometro para guardar las horas','danger');

	}

})

Template.cambio.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('cambios', bufeteId);
   });
});

Template.cambio.helpers({
	valor() {
		return Cambio.findOne().cambio;
	}
});

Template.cambio.events({
	'keyup .cambio': function (e, t) {


		if (e.which == 13) {
			let datos = {
				id: Meteor.user().profile.bufeteId,
				cambio: t.find('[name="tipo-cambio"]').value
			}

			Meteor.call('actualizarCambio', datos, function (err) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Actualizaste el tipo de cambio', 'success');
				}
			});
		}

	}
});
