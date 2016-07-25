Template.crearTarifaModal.onCreated(function () {

	let self = this;
	let bufeteId = Meteor.user().profile.bufeteId;

	self.autorun(function () {
		self.subscribe('equipo',bufeteId);
		self.subscribe('cambios',bufeteId);
	})


})


Template.crearTarifaModal.helpers({
	miembros(){
		return Meteor.users.find();
	},
	rol(){
		debugger;
		if(this.roles.bufete.length==1) return this.roles.bufete[0];
		if(this.roles.bufete[1].split(" ").length>1) return this.roles.bufete[1].split(" ")[0] +"-"+ this.roles.bufete[1].split(" ")[1];
		return this.roles.bufete[1];

	}
});


Template.crearTarifaModal.events({
	'click .cambio'(){
		Modal.show('agregarTipoCambio')
	},
	'keyup .valor-soles'(event,template){
		if(Cambio.find().count()!=0){
			//debugger;
			let dolar= (event.target.value / Cambio.find().fetch()[0].cambio).toFixed(2);
			event.target.parentElement.parentElement.querySelector('.valor-dolares').value = dolar ;
			let rol = event.target.parentElement.parentElement.className;
			$(".miembros-roles").find("."+rol).find(".valor-soles-miembro").val(event.target.value)
			$(".miembros-roles").find("."+rol).find(".valor-dolares-miembro").val(dolar);
			return;
		}

		Bert.alert('No se ha añadido algun tipo de cambio','danger');
	},
	'keyup .valor-soles-miembro'(event,template){
		if(Cambio.find().count()!=0){
			//debugger;
			let dolar= (event.target.value / Cambio.find().fetch()[0].cambio).toFixed(2);
			event.target.parentElement.parentElement.querySelector('.valor-dolares-miembro').value = dolar ;
			return;
		}

		Bert.alert('No se ha añadido algun tipo de cambio','danger');

	},
	'click .registrar-tarifa'(event,template){
		//debugger;
		var tarifa ={}
		tarifa.nombre = template.find("[name='nombre-tarifa']").value;
		let tarifas_roles = []
		let tarifas_miembros = []

		let miembros = $(".miembros-roles").children()
		let roles = $(".roles").children();

		for (var i = 0; i < roles.length; i++) {
			let rol = {}
			rol.nombre = roles[i].className.replace("-"," ");
			rol.soles = roles[i].childNodes[3].childNodes[0].value;
			tarifas_roles.push(rol);
		}

		for (var i = 0; i < miembros.length; i++) {
			let data = {}
			data.id = $(".miembros-roles").children().children().children("h1").get(i).innerHTML;
			data.nombre = $(".miembros-roles").children().children().children("span").get(i).innerHTML;
			data.soles = $(".miembros-roles").children().children().children("input.valor-soles-miembro").get(i).value;

			tarifas_miembros.push(data);
		}

		tarifa.roles = tarifas_roles;
		tarifa.miembros = tarifas_miembros;
		tarifa.bufeteId = Meteor.user().profile.bufeteId;

		if (tarifa.nombre !== "") {
			Meteor.call('registrarTarifa',tarifa,function (err) {
				if(err) return Bert.alert('No se pudo registrar la tarifa, intentelo nuevamente','danger');
				Bert.alert('Se registro correctamente la tarifa','success');
				$("input[type='number']").val("");
				$("input[type='text']").val("");
        Modal.hide('crearTarifaModal');
			});
		} else {
			Bert.alert('Ingresa el nombre de la tarifa','warning');
		}

	}
});
