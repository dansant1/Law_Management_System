Meteor.startup(function () {});

Template.menu.onRendered(function () {
	window.Intercom("boot", {
  		app_id: "ozpz9hmm",
  		name: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido, // Full name
    	email: Meteor.user().emails[0].address
	});
});

Template.menu.events({
	'click .logout': () => {
		Meteor.logout();
		window.Intercom("shutdown");
	},
	'click .agregar-tarea': () =>{
		Modal.show('nuevaTareaModal')
	},
	'click .agregar-nota': () =>{
		Modal.show('notaxasuntosModal')
	},
	'click .agregar-evento': () =>{
		Modal.show('evento');
	},
	'click .agregar-cliente': () =>{
		Modal.show('clienteNuevoModal');
	},
	'click .asunto-modal': () => {
		Modal.show('AsuntoNuevoModal');	
	},
	'click .tour'() {
		Modal.show('tourInicial');
	},
	'click .modal-cliente'() {
		Modal.show('ModalClienteNuevo2');
	},
	'click .workflow-modal'() {
		Modal.show('workflowModal');
	},
	'click .hora-modal'() {
		Modal.show('horaModal');
	},
	'click .tarifa-modal'() {
		Modal.show('tarifaModal');
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
		debugger;
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


		$(".hora-crono")[0].textContent = (chronometer.hours ? (chronometer.hours > 9 ? chronometer.hours : "0" + chronometer.hours) : "00") + ":" + (chronometer.minutes ? (chronometer.minutes > 9 ? chronometer.minutes : "0" + chronometer.minutes) : "00");


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
		swal({  title: "¿Segúro que quieres resetear el cronometro?",
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
				debugger;
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
