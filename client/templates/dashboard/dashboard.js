UI.registerHelper('getFirstLettersOfName', function (nombre, apellido) {

		if (apellido === undefined) {
			apellido = "";
		}

		if (nombre !== "" ) {
			let primeraLetraNombre = nombre.charAt(0).toUpperCase();
			let primeraLetraApellido = apellido.charAt(0).toUpperCase();

			return primeraLetraNombre + primeraLetraApellido;
		} else {
			return "S/N";
		}

	});

Template.tareasDetalle2.helpers({
	nombre() {
		return Meteor.user().profile.nombre;
	},
	apellido() {
		return Meteor.user().profile.apellido;
	}
});

Template.calendarioSidebar.events({
	'click .nuevo-event': function () {
		Modal.show('modalNuevoEvento');
	}
});

Template.teamSidebarDahboard.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
   });
});





Template.etapa.helpers({
	tareas(){
		return Tareas.find({'etapa.id':this._id,'etapa':{$exists:true}})
	},
	asuntoId(){
		return FlowRouter.getParam('asuntoId')
	},
	tareasSinEtapas(){
		//return Tareas.find({'asunto.id':FlowRouter.getParam('asuntoId'),etapa:{$exists:false}})
	},
	dia(date) {
		var d = date,
    	// minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	// hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	// ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	mitarea(){
		return this.asignado.id == Meteor.userId();
	},
	checked: function () {
		if (this.abierto === true) {
			return "";
		} else if (this.abierto === false) {
			return "checked";
		}
	}
})

Template.etapa.events({
	'click .agregar-fecha-tarea'(event,template){
		Modal.show('fechaTareaModal',this)
	},
	'click .agregar-miembro-tarea'(){
		Modal.show('miembroTareaModal',this);
	},
	'change .etapa': function (){

		if (this.abierto === true) {
			Meteor.call('cerrarEtapa', this._id, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Completaste la etapa', 'success');
				}
			});
		} else if (this.abierto === false) {
			Meteor.call('abrirEtapa', this._id, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Abriste la etapa', 'success');
				}
			});
		}


	},
	'change .check-tarea': function () {
		if (this.abierto === true) {
			Meteor.call('cerrarTarea', this._id, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Completaste la tarea', 'success');
				}
			});
		} else if (this.abierto === false) {
			Meteor.call('abrirTarea', this._id, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Abriste la tarea', 'success');
				}
			});
		}
	},
	'keyup [name="crear-tarea-etapa"]'(event,template){
		let datos = {
			descripcion: template.find('[name="crear-tarea-etapa"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			asunto:{
				id:FlowRouter.getParam('asuntoId'),
				nombre: Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].caratula
			},
			etapa: {
				id: this._id,
				nombre: Etapas.find({_id:this._id}).fetch()[0].nombre
			},
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}
		}


		//debugger;
		if(event.which == 13){
        	//$(event.target).blur();
        	Meteor.call('agregarTarea', datos, function (err, result) {
        		if (err) return Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
    			template.find('[name="crear-tarea-etapa"]').value = "";
    			Bert.alert('Agregaste una tarea', 'success');
        	});
    	}
	}
})

Template.etapasAsunto.onCreated(function () {
	let self = this;

	self.autorun(function () {
		let asuntoId = FlowRouter.getParam('asuntoId');
		Meteor.subscribe('etapasxasunto',asuntoId);
	})
})

Template.etapasAsunto.helpers({
	asunto(){
		return FlowRouter.getParam('asuntoId')
	},
	etapas(){
		return Etapas.find()
	}
})

Template.etapasAsunto.events({
	'keyup [name="crear-etapa"]': function (event, template) {
		if(event.which == 13){
			debugger;

			let datos = {
				nombre: template.find("[name='crear-etapa']").value,
				asunto: {
					id: FlowRouter.getParam('asuntoId'),
					nombre: Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].caratula
				},
				bufeteId: Meteor.user().profile.bufeteId,
				creador: {
					nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
					id: Meteor.userId()
				},
				abierto: true
			}

			Meteor.call('agregarEtapaAsunto', datos, function (err, result) {
				if (err) return Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');

				Bert.alert('Agregaste una tarea', 'success');

				template.find('[name="crear-etapa"]').value = "";
			});
		}
	}
})

Template.tareasCerradas.onCreated(function () {
	var self = this;

	self.autorun(function() {
		self.subscribe('tareasCerradas');
	});
});

Template.tareasCerradas.helpers({
	tareas: function () {
		return Tareas.find({}, {sort: {createdAt: -1}});
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
	},
	dia(fecha) {
		var d = fecha,
				minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
				hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
				ampm = d.getHours() >= 12 ? 'pm' : 'am',
				months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
				days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	}
});

Template.cuadroTareaNueva.events({
	'click .nuevo'(){
		Modal.show('nuevaTareaModal')
	}
})

Template.tareaItemCuadro.helpers({
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
	},
	dia(fecha) {
		debugger;
		console.log(fecha)
		var d = new Date(fecha),
				minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
				hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
				ampm = d.getHours() >= 12 ? 'pm' : 'am',
				months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
				days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	}
})




Template.tareasSidebarDashboard.onCreated(function () {
	var self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	self.autorun(function() {
    	self.subscribe('tareas',bufeteId);
   });
});

Template.tareasSidebarDashboard.helpers({
	tareas() {

		let hoy = new Date();
		hoy.setHours(0,0,0,0);
		let mañana = new Date();
		mañana.setDate(mañana.getDate()+1);
		mañana.setHours(0,0,0,0)

		return Tareas.find({'vence':{$gte:hoy,$lt:mañana},'asignado.id': Meteor.userId(), abierto: true});
	},
	hayTareas() {
		return Tareas.find({'asignado.id': Meteor.userId(), abierto: true}).fetch().length > 0
	}
});

Template.tareasSidebarDashboard.events({
	'click .nueva-tarea-dash'(){
		Modal.show('nuevaTareaModal2');
	}
})

Template.itemTareas.helpers({
	asuntoId() {
		return Tareas.findOne({'asignado.id': Meteor.userId()}).asunto.id
	}
});



Template.teamSidebarDahboard.helpers({
	miembros: function () {
		return Meteor.users.find();
	}
});

Template.teamSidebarDahboard.events({
	'click .nuevo': () => {
		Modal.show('usuarioForm2');
	}
});


Template.botonNuevosContactos.events({
	'click .persona': function () {
		Modal.show('ModalClienteNuevo2');
	},
	'click .empresa': function () {
		Modal.show('empresaNuevoModal');
	},
	'click .caso': function () {
		Modal.show('casoNuevoModal');
	}
});

Template.clienteNuevoModal.onCreated(function () {
	var self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	self.autorun(function () {
		self.subscribe('tarifas',bufeteId)
	})
})

Template.clienteNuevoModal.helpers({
	tarifas(){
		return Tarifas.find();
	}
})

Template.clienteNuevoModal.events({
	'click .guardar-contacto': function (event, template) {
		event.preventDefault();
		//debugger;
		let datos = {
			nombre: template.find('[name="nombre"]').value,
			apellido: template.find('[name="apellido"]').value || "",
			direccion: template.find('[name="direccion-contacto"]').value || "",
			telefono: template.find('[name="telefono"]').value || "",
			celular: template.find('[name="celular"]').value || "",
			email: template.find('[name="email"]').value || "",
			identificacion: template.find('[name="identificacion"]').value || "",
			provincia: template.find('[name="provincia"]').value || "",
			pais: template.find('[name="pais"]').value || "",
			bufeteId: Meteor.user().profile.bufeteId,
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
		}

		if(template.find("[name='ruc']").value!=""
			&& template.find("[name='direccion']").value!=""
			&& template.find("[name='telefono-facturacion']").value != ""
			&& template.find("[name='tarifa']").value!=""
			&& template.find("[name='tipo-descuento']").value!=""
			&& template.find("[name='valor-descuento']").value!=""
			){

				datos.facturacion = {
					ruc: template.find("[name='ruc']").value || "",
					direccion: template.find("[name='direccion']").value || "",
					telefono: template.find("[name='telefono-facturacion']").value || "",
					solicitante:{
						nombre: template.find("[name='nombre-solicitante']").value || "",
						telefono: template.find("[name='telefono-solicitante']").value || "",
						correo: template.find("[name='correo-solicitante']").value || ""
					},
					tarifa:{
						id:template.find("[name='tarifa']").value,
						nombre: $(template.find("[name='tarifa']")).find("option:selected").html()
					},
					tipo_moneda: template.find("[name='tipo-moneda']").value,
					forma_cobro: template.find("[name='forma-cobro']").value,
					descuento:{
						tipo:template.find("[name='tipo-descuento']").value,
						valor:template.find("[name='valor-descuento']").value
					},
					cobranza: template.find("[name='cobranza']").value,
					alertas:{
						horas: template.find("[name='horas']").value,
						monto: template.find("[name='monto']").value,
						horas_no_cobradas: template.find("[name='horas-no-cobradas']").value,
						monto_horas_no_cobradas: template.find("[name='monto-horas-no-cobradas']").value
					}
				}
			}
			console.log(datos.facturacion);

		if (datos.nombre !== "") {
			Meteor.call('crearCliente', datos, function (err, result) {
				debugger;
				if (err) {
					console.log(err);

				} else {

					template.find('[name="nombre"]').value = "";
					template.find('[name="apellido"]').value ="" ;
					template.find('[name="direccion"]').value = "";
					template.find('[name="telefono"]').value = "";
					template.find('[name="celular"]').value = "";
					template.find('[name="email"]').value = "";
					template.find('[name="identificacion"]').value = "";
					template.find('[name="provincia"]').value = "";
					template.find('[name="pais"]').value = "";

					FlowRouter.go('/clientes2');
				}
			});
		} else {
			Bert.alert( 'Ingrese correctamente los datos', 'warning' );
		}
	}
});


Template.empresaNuevoModal.events({
	'click .guardar-contacto': function (event, template) {
		event.preventDefault();

		let datos = {
			nombre: template.find('[name="nombre"]').value,
			direccion: template.find('[name="direccion"]').value || "",
			telefono: template.find('[name="telefono"]').value || "",
			celular: template.find('[name="celular"]').value || "",
			email: template.find('[name="email"]').value || "",
			identificacion: template.find('[name="identificacion"]').value || "",
			provincia: template.find('[name="provincia"]').value || "",
			pais: template.find('[name="pais"]').value || "",
			bufeteId: Meteor.user().profile.bufeteId,
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
		}

		if (datos.nombre !== "") {
			Meteor.call('crearEmpresa', datos, function (err, result) {

				if (err) {
					console.log('algo salio mal :(');
				} else {

					template.find('[name="nombre"]').value = "";

					template.find('[name="direccion"]').value = "";
					template.find('[name="telefono"]').value = "";
					template.find('[name="celular"]').value = "";
					template.find('[name="email"]').value = "";
					template.find('[name="identificacion"]').value = "";
					template.find('[name="provincia"]').value = "";
					template.find('[name="pais"]').value = "";

					FlowRouter.go('/clientes2');
				}
			});
		} else {
			Bert.alert( 'Ingrese correctamente los datos', 'warning' );
		}
	}
});

Template.asuntosSidebarDashboard.onCreated( function () {

	var self = this;

	self.autorun(function() {

		let id = Meteor.user()._id;
		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntosxequipo', id,bufeteId);
   });

});

Template.asuntosSidebarDashboard.helpers({
	esAdministrador() {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) || Roles.userIsInRole( Meteor.userId(), ['socio'], 'bufete' )) {
			return true;
		} else {
			return false;
		}
	}
});

Template.cuadroAsuntos.onCreated( function () {

	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntos', bufeteId);
   });

});

Template.cuadroAsuntos.helpers({
	asuntos() {
		return Asuntos.find({}, {sort: {createdAt: -1}});
	}
});

Template.cuadroAsuntos.events({
	'click .asunto-especifico':(event,template)=> {
		debugger;
		Session.set('asunto-id',$(event.target).data('id'));
	}
})

Template.asuntosSidebarDashboard.helpers({
	asuntos() {
		return Asuntos.find({abierto:true}, {limit: 3})
	},
	verificado(){
		return Asuntos.find({abierto:true}).count()>=3;
	}
});

Template.asuntosSidebarDashboard.events({
	'click .nuevo': () => {
		Modal.show('asuntoNuevoModal');
	}
});

Template.clientesSidebarDashboard.onCreated( function () {

	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('clientes', bufeteId);
   });

});

Template.clientesSidebarDashboard.helpers({
	clientes() {
		return Clientes.find({estatus:'cliente'}, {sort: {createdAt: -1}});
	}
});

Template.clientesSidebarDashboard.events({
	'click .nuevo': () => {
		Modal.show('ModalClienteNuevo2');
	}
});

Template.asuntos2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	tipo_busqueda(){

		if(Session.get('tipo-busqueda')=="Clientes") return "cliente"
		return "asunto"

	},
	asuntos() {
		debugger;
		var regexCaratula = new RegExp(".*"+ Session.get('caratula-asunto') +".*","i")
		var regexNombre = new RegExp(".*"+Session.get('nombre-cliente')+".*","i");

		return Asuntos.find({caratula:regexCaratula,abierto:Session.get('estado-asunto'),"cliente.nombre":regexNombre}, {sort: {createdAt: -1}});
	},
	cantidad() {
		return Asuntos.find({abierto:Session.get('estado-asunto')}).fetch().length;
	},
	tipo(){

		let estado = Session.get('estado-asunto')? 'abiertos' : 'archivados';
		return estado;
 	},
 	esAdministrador() {
 		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) || Roles.userIsInRole( Meteor.userId(), ['socio'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
 	}
});

Template.asuntos2.onCreated( function () {

	var self = this;

	Session.set('estado-asunto',true);
	Session.set('nombre-cliente',"")
	Session.set('caratula-asunto',"")
	/*self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntos', bufeteId);
   	});	*/

   	let id = Meteor.user()._id;
	let bufeteId = Meteor.user().profile.bufeteId;
    self.subscribe('asuntosxequipo', id,bufeteId);

});

Template.asuntos2.events({
	'click .nuevo': () => {
		Modal.show('asuntoNuevoModal');
	},
	'click .abiertos':() =>{
		Session.set('estado-asunto',true);

	},
	'click .archivados':()=>{
		Session.set('estado-asunto',false);
	},
	'keyup .buscador-asuntos'(event,template){
		debugger;
		var query = template.find("[name='consulta']").value;
		var tipo = template.find("[name='tipo']").value

		if(tipo==="clientes") Session.set("nombre-cliente",query)
		else Session.set("caratula-asunto",query);

	},
	'change .tipo-busqueda'(event,template){
		debugger;
		var tipo = template.find("[name='tipo']").value;

		if(tipo==="clientes") {
			Session.set("caratula-asunto","");
			Session.set("tipo-busqueda","Clientes")
		}
		else{
			Session.set("nombre-cliente","")
			Session.set("tipo-busqueda","Asuntos")
		}

	}
});

Template.cuadroAsuntoNuevo.events({
	'click .nuevo-1': () => {
		Modal.show('asuntoNuevoModal');
	}
});

Template.asuntoItemCuadro.helpers({
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	},
	estaAbierto: () =>{

		return this.abierto;
	}
})

Template.asuntoItemCuadro.events({
	'click .cerrar-asunto': (event,template) => {

		swal({  title: "¿Segúro que quieres archivar este asunto?",
				text: "Este asunto ya no estara disponible para el resto de tu equipo",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, archivar asunto",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: true
			},
			function() {
				let asuntoId = $(event.target).data('id');
				console.log(asuntoId)
				Meteor.call('cerrarAsunto', asuntoId, function (err) {
					if (err) {
						console.log(err)
						Bert.alert('Hubo un error, vuelve a intentalo', 'warning');
					} else {
						swal("Asunto cerrado", "El asunto ha sido cerrado correctamente.", "success");
					}

				});

			});
	},
	'click .editar-asunto': (event,template) => {
		Session.set('asunto-escogido-id',$(event.target).data('id'))
		Modal.show('editarAsuntoModal',this);
	}
});

Template.detalleAsunto2.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
		let bufeteId = Meteor.user().profile.bufeteId;
    	let etapaId = FlowRouter.getParam('etapaId');
    	self.subscribe('etapa', etapaId);
    	self.subscribe('expediente', asuntoId);
   });
});

Template.detalleEtapaAsunto2.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);

   });
});

Template.detalleEtapaAsunto2.helpers({
	email() {
		return Meteor.user().emails[0].address;
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	}
});

Template.tareasEtapaAsunto.events({
	'keyup [name="crear-tarea"]'(event,template){
		if(event.which == 13){
			debugger;

			let datos = {
				descripcion: template.find("[name='crear-tarea']").value,
				asunto: {
					nombre: Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].caratula,
					id: FlowRouter.getParam('asuntoId')
				},
				bufeteId: Meteor.user().profile.bufeteId,
				etapa:{
					id: FlowRouter.getParam('etapaId'),
					nombre: Etapas.find({_id:FlowRouter.getParam('etapaId')}).fetch()[0].nombre
				},
				asignado: {
					nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
					id: Meteor.userId()
				},
				creador: {
					nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
					id: Meteor.userId()
				}
			}

			if (datos.asunto.nombre === "Elige un asunto" && datos.asunto.id === "") {
				datos.asunto.nombre = undefined;
				datos.asunto.id = undefined;
			}

			if (datos.descripcion !== "" && datos.fecha !== "") {
				Meteor.call('crearTareaEtapa', datos, function (err, result) {

					if (err) return Bert.alert('Error al tratar de registrar, intentelo de nuevo', 'danger');

					template.find("[name='crear-tarea']").value="";
					Modal.hide('nuevaTareaAsuntoModal')
					Bert.alert('Agregaste una tarea', 'success');
				});
			} else {
				Bert.alert('Ingresa los datos', 'warning');
			}

		}
	}
})

Template.tareasEtapaAsunto.helpers({
	tareas(){
		return Tareas.find({'etapa.id':FlowRouter.getParam('etapaId')});
	}
})

Template.detalleAsunto2.helpers({
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
	},
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.tareasDelAsunto.onCreated( function () {

	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('tareasxAsunto', asuntoId);
   });

});

Template.tareasDelAsunto.helpers({
	tareas() {
		return Tareas.find({ 'asunto.id': FlowRouter.getParam('asuntoId'), 'etapa.id':FlowRouter.getParam('etapaId'),abierto: true }, {sort: {createdAt: -1}});
	},
	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	esMiTarea() {
  		if (this.asignado.id === Meteor.userId()) {
  			return true;
  		} else {
  			false
  		}
  	}
});

Template.tareasDelAsunto.events({
	'keyup [name="crear-tarea"]': function (event, template) {

		let datos = {
			descripcion: template.find('[name="crear-tarea"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			asunto: {
				id: FlowRouter.getParam('asuntoId')
			}
		}

		if(event.which == 13){
        	//$(event.target).blur();
        	template.find('[name="crear-tarea"]').value = "";
        	Meteor.call('agregarTareaAsunto', datos, function (err, result) {
        		if (err) {
        			Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        			template.find('[name="crear-tarea"]').value = "";
        		} else {
        			template.find('[name="crear-tarea"]').value = "";
        			Bert.alert('Agregaste una tarea', 'success');
        		}
        	});
    	}
	},
	'click .cerrar': function () {
		let tareaId = this._id;

		Meteor.call('cerrarTarea', tareaId,function (err, result) {
			if (err) {
				Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
			} else {
				Bert.alert('Completaste la tarea', 'success');
			}
		});
	}
});

Template.detalleTareaAsunto.events({
	'keyup [name="crear-tarea"]': function (event, template) {

		let datos = {
			descripcion: template.find('[name="crear-tarea"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			asunto: {
				id: FlowRouter.getParam('asuntoId')
			}
		}



		if(event.which == 13){
        	//$(event.target).blur();
        	template.find('[name="crear-tarea"]').value = "";
        	Meteor.call('agregarTareaAsunto', datos, function (err, result) {
        		if (err) {
        			Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        			template.find('[name="crear-tarea"]').value = "";
        		} else {
        			template.find('[name="crear-tarea"]').value = "";
        			Bert.alert('Agregaste una tarea', 'success');
        		}
        	});
    	}
	},
	'click .cerrar': function () {
		let tareaId = this._id;

		Meteor.call('cerrarTarea', tareaId,function (err, result) {
			if (err) {
				Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
			} else {
				Bert.alert('Completaste la tarea', 'success');
				FlowRouter.go('/asuntos2/d/' + FlowRouter.getParam('asuntoId'));
			}
		});
	}
});

Template.detalleTareaAsunto.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('tareasxAsunto', asuntoId);
    	self.subscribe('expediente', asuntoId);
		let tareaId = FlowRouter.getParam('tareaId');
    	self.subscribe('comentarioDeTareas', tareaId, Meteor.user().profile.bufeteId);
   });
});

Template.detalleTareaAsunto.helpers({
	tareas() {
		return Tareas.find({ 'asunto.id': FlowRouter.getParam('asuntoId'), abierto: true }, {sort: {createdAt: -1}});
	},
	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	comentarios: () => {
		return ComentariosDeTareas.find({}, {sort: {createdAt: -1}});
	},
	tarea: () => {
		return Tareas.findOne({ _id: FlowRouter.getParam('tareaId') });
	},
	hayFecha: (fecha) => {
		if (fecha !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	dia() {
		var d = this.vence,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
	},
	tareaId: () => {
    	return FlowRouter.getParam('tareaId');
  	},
  	esMiTarea() {
  		if (this.asignado.id === Meteor.userId()) {
  			return true;
  		} else {
  			false
  		}
  	}
});


Template.tareasDetalle2.events({
	'keyup [name="crear-tarea"]': function (event, template) {

		let datos = {
			descripcion: template.find('[name="crear-tarea"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}
		}



		if(event.which == 13){
        	//$(event.target).blur();
        	template.find('[name="crear-tarea"]').value = "";
        	Meteor.call('agregarTarea', datos, function (err, result) {
        		if (err) {
        			Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        			template.find('[name="crear-tarea"]').value = "";
        		} else {
        			template.find('[name="crear-tarea"]').value = "";
        			Bert.alert('Agregaste una tarea', 'success');
        		}
        	});
    	}
	},
	'change .cerrar': function () {
		let tareaId = this._id;

		if (this.abierto === true) {
				Meteor.call('cerrarTarea', tareaId,function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
				Bert.alert('Completaste la tarea', 'success');
				}
			});
		} else if (this.abierto === false) {
			Meteor.call('abrirTarea', this._id, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Desmarcaste la tarea', 'success');
				}
			});
		}
	},
	'click .comentar': function (event, template) {
		debugger;
		let datos = {
			comentario: template.find('[name="comentario"]').value,
			tareaId: FlowRouter.getParam('tareaId'),
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			bufeteId: Meteor.user().profile.bufeteId
		}

		Meteor.call('agregarComentarioATarea', datos,function (err) {
			if (err) {
				Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				template.find('[name="comentario"]').value = ""
			} else {
				template.find('[name="comentario"]').value = ""
			}
		});
	},
	'click .agregar-fecha': function () {
		Modal.show('venceTareaModal');
	},
	'click .adjuntar-archivo-tarea': function () {
		Modal.show('adjuntarArchivoTarea');
	},
	'click .regresar': () => {
		FlowRouter.go('/tareas');
	}
});

Template.tareasDetalle2.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('misTareas');

			let tareaId = FlowRouter.getParam('tareaId');
    	self.subscribe('comentarioDeTareas', tareaId, Meteor.user().profile.bufeteId);
   });
});

Template.tareasDetalle2.helpers({
	hecho: function () {
		var hecho = this.abierto;

		if (hecho) {
			return "";
		} else {
			return "checked";
		}
	},
	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	comentarios: () => {
		return ComentariosDeTareas.find({}, {sort: {createdAt: -1}});
	},
	tarea: () => {
		return Tareas.findOne({ _id: FlowRouter.getParam('tareaId') });
	},
	hayFecha: (fecha) => {
		if (fecha !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	dia() {
		var d = this.vence,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
	},
	tareaId: () => {
    	return FlowRouter.getParam('tareaId');
  	},
  	esMiTarea() {
  		if (this.asignado.id === Meteor.userId()) {
  			return true;
  		} else {
  			false
  		}
  	},
		estaAsignado() {
			if (this.asignado.nombre === Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido) {
				return "Asignado a ti";
			} else {
				return this.asignado.nombre;
			}
		},
		comentador() {
			if (this.creador.nombre === Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido) {
				return "Tú";
			} else {
				return this.creador.nombre;
			}
		}
});

Template.cuadroSubTareas.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let tareaId = FlowRouter.getParam('tareaId');
    	self.subscribe('Subtareas', tareaId);
   });
});

Template.cuadroSubTareas.helpers({
	subtareas() {
		return Subtareas.find({}, {sort: {createdAt: -1}});
	},
	'checked': function(){
        var isCompleted = this.abierto;
        if(isCompleted){
            return "";
        } else {
            return "checked";
        }
    }
});

Template.cuadroSubTareas.events({
	'keyup [name="crear-subtarea"]': function (event, template) {

		let datos = {
			descripcion: template.find('[name="crear-subtarea"]').value,
			tareaId: FlowRouter.getParam('tareaId'),
			bufeteId: Meteor.user().profile.bufeteId
		}



		if(event.which == 13){
        	//$(event.target).blur();
        	template.find('[name="crear-subtarea"]').value = "";
        	Meteor.call('crearSubtarea', datos, function (err, result) {
				debugger;
        		if (err) {
        			Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        			template.find('[name="crear-subtarea"]').value = "";
        		} else {
        			template.find('[name="crear-subtarea"]').value = "";
        			Bert.alert('Agregaste una sub tarea', 'success');
        		}
        	});
    	}
	},
	'change .cerrar-subtarea': function () {

		if (this.abierto === true) {
			Meteor.call('cerrarSubTarea', this._id, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Completaste la subtarea', 'success');
				}
			});
		} else if (this.abierto === false) {
			Meteor.call('abrirSubtarea', this._id, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					Bert.alert('Desmarcaste la subtarea', 'success');
				}
			});
		}
	}
});

// Funcion para convertir string con tildes a string normal
 var defaultDiacriticsRemovalMap = [
        {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
        {'base':'AA','letters':'\uA732'},
        {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
        {'base':'AO','letters':'\uA734'},
        {'base':'AU','letters':'\uA736'},
        {'base':'AV','letters':'\uA738\uA73A'},
        {'base':'AY','letters':'\uA73C'},
        {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
        {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
        {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
        {'base':'DZ','letters':'\u01F1\u01C4'},
        {'base':'Dz','letters':'\u01F2\u01C5'},
        {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
        {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
        {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
        {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
        {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
        {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
        {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
        {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
        {'base':'LJ','letters':'\u01C7'},
        {'base':'Lj','letters':'\u01C8'},
        {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
        {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
        {'base':'NJ','letters':'\u01CA'},
        {'base':'Nj','letters':'\u01CB'},
        {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
        {'base':'OI','letters':'\u01A2'},
        {'base':'OO','letters':'\uA74E'},
        {'base':'OU','letters':'\u0222'},
        {'base':'OE','letters':'\u008C\u0152'},
        {'base':'oe','letters':'\u009C\u0153'},
        {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
        {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
        {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
        {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
        {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
        {'base':'TZ','letters':'\uA728'},
        {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
        {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
        {'base':'VY','letters':'\uA760'},
        {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
        {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
        {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
        {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
        {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
        {'base':'aa','letters':'\uA733'},
        {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
        {'base':'ao','letters':'\uA735'},
        {'base':'au','letters':'\uA737'},
        {'base':'av','letters':'\uA739\uA73B'},
        {'base':'ay','letters':'\uA73D'},
        {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
        {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
        {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
        {'base':'dz','letters':'\u01F3\u01C6'},
        {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
        {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
        {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
        {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
        {'base':'hv','letters':'\u0195'},
        {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
        {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
        {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
        {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
        {'base':'lj','letters':'\u01C9'},
        {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
        {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
        {'base':'nj','letters':'\u01CC'},
        {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
        {'base':'oi','letters':'\u01A3'},
        {'base':'ou','letters':'\u0223'},
        {'base':'oo','letters':'\uA74F'},
        {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
        {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
        {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
        {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
        {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
        {'base':'tz','letters':'\uA729'},
        {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
        {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
        {'base':'vy','letters':'\uA761'},
        {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
        {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
        {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
        {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
    ];

    var diacriticsMap = {};
    for (var i=0; i < defaultDiacriticsRemovalMap .length; i++){
        var letters = defaultDiacriticsRemovalMap [i].letters;
        for (var j=0; j < letters.length ; j++){
            diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap [i].base;
        }
    }

    // "what?" version ... http://jsperf.com/diacritics/12
    function removeDiacritics (str) {
        return str.replace(/[^\u0000-\u007E]/g, function(a){
           return diacriticsMap[a] || a;
        });
    }
// Fin de la funcion para convertir string con tildes a string normal

function subirArchivoTarea (event, template) {
    let datos = {
      nombre: template.find('[name="nombre"]').value,
    }

    let archivo = document.getElementById("myArchivo");

    if ('files' in archivo) {

        if (archivo.files.length == 0) {
           Bert.alert('Selecciona un archivo, vuelve a intentarlo', 'warning');
        } else if (archivo.files.length > 1) {
           Bert.alert('Selecciona solo un archivo, vuelve a intentarlo', 'warning');
        } else {


          for (var i = 0; i < archivo.files.length; i++) {

            var filei = archivo.files[i];

            var doc = new FS.File(filei);

            var nuevoNombre = removeDiacritics(doc.name());
            doc.name(nuevoNombre);

            doc.metadata = {
              creadorId: Meteor.userId(),
              bufeteId: Meteor.user().profile.bufeteId,
              nombre: datos.nombre,
              tareaId: FlowRouter.getParam('tareaId')
            };

            DocumentosTareas.insert(doc, function (err, fileObj) {
              if (err) {
                Bert.alert('Hubo un problema', 'warning');
              } else {
                $('#doc-modal').modal('hide');
                Bert.alert('Subiste el archivo', 'success');
              }
            });
          }
        }
    }
} // Fin de la funcion subirArchivoTarea

Template.detalleTareaAsunto.events({
	'click .adjuntar-archivo-tarea': function () {
		Modal.show('adjuntarArchivoTarea');
	}
});

Template.fullScreenTareaAsunto.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('tareasxAsunto', asuntoId);
    	self.subscribe('expediente', asuntoId);
		let tareaId = FlowRouter.getParam('tareaId');
		self.subscribe('docs')
    	self.subscribe('comentarioDeTareas', tareaId, Meteor.user().profile.bufeteId);
   });
});

Template.fullScreenTareaAsunto.events({
	'click .adjuntar-archivo-tarea': function () {
		Modal.show('adjuntarArchivoTarea');
	}
});

Template.fullScreenTareaAsunto.helpers({
	tareas() {
		return Tareas.find({}, {sort: {createdAt: -1}});
	},
	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	tareaId: () => {
    	return FlowRouter.getParam('tareaId');
  	},
  	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	comentarios: () => {
		return ComentariosDeTareas.find({}, {sort: {createdAt: -1}});
	},
	tarea: () => {
		return Tareas.findOne({ _id: FlowRouter.getParam('tareaId') });
	},
	hayFecha: (fecha) => {
		if (fecha !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	dia() {
		var d = this.vence,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
	}

});

Template.asuntosDocs3.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);
   });
});

Template.asuntosDocs3.helpers({
	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	hayFecha: (fecha) => {
		if (fecha !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	dia() {
		var d = this.vence,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
	}
});

Template.asuntosDocsDetalle.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);
    	let bufeteId = Meteor.user().profile.bufeteId;
		self.subscribe('docsAsunto', asuntoId);
   });
});



Template.cuadroVersionesDocumentos.helpers({
	versiones(){
		return Documentos.find({'metadata.version':{$exists:true},'metadata.version':FlowRouter.getParam('documentoId')})
	}
})

Template.asuntosDocsDetalle.events({
	'click .adjuntar-archivo-version'(event,template){
		$(template.find("[name='archivo']")).click()
	},
	'change [name="archivo"]'(event,template){

		let archivo = template.find('[name="archivo"]');

	    if ('files' in archivo) {

	          for (var i = 0; i < archivo.files.length; i++) {

				var documento = Documentos.find({_id:FlowRouter.getParam('documentoId')}).fetch()[0];

	            var filei = archivo.files[i];

	            var doc = new FS.File(filei);

	            doc.metadata = {
	              	creadorId: Meteor.userId(),
	              	bufeteId: Meteor.user().profile.bufeteId,
	              	subdoc: false,
	              	descripcion: documento.metadata.descripcion,
	              	nombre: documento.metadata.nombre,
	              	asunto: {
		                nombre: Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].caratula,
		                id: FlowRouter.getParam('asuntoId')
					},
					version: FlowRouter.getParam('documentoId')
	            };

	            Documentos.insert(doc, function (err, fileObj) {
	              if (err) return Bert.alert('Hubo un problema', 'warning');
				  let data = {
					nombre: documento.metadata.nombre,
					asunto: {
						nombre: documento.metadata.asunto.nombre,
						id: doc.metadata.asunto.id
					},
					creador: {
						nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
						id: Meteor.userId()
					},
					bufeteId: Meteor.user().profile.bufeteId,
					version: FlowRouter.getParam('documentoId')
				  }
					Meteor.call('agregarDocNews', data, function (err) {
						if (err) return	Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
						template.find('[name="nombre"]').value = "";
						template.find('[name="descripcion"]').value = "";
						$('#doc-modal').modal('hide');
						Bert.alert('Subiste el archivo', 'success');

					});

				})
			}
	    }
	}
})

Template.asuntosDocsDetalle.helpers({
	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	hayFecha: (fecha) => {
		if (fecha !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	dia() {
		var d = this.vence,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
	},
	documentos() {
		return Documentos.find({'metadata.version':{$exists:false}}, {sort: {createdAt: -1}});
	},
	archivo() {
		return Documentos.findOne({_id: FlowRouter.getParam('documentoId')});
	}
});

Template.fullScreenTareaAsuntoDocs.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('tareasxAsunto', asuntoId);
    	self.subscribe('expediente', asuntoId);
		self.subscribe('docs')
		let tareaId = FlowRouter.getParam('tareaId');
		self.subscribe('archivosDeTareas', tareaId);
   });
});

Template.fullScreenTareaAsuntoDocs.events({
	'click .adjuntar-archivo-tarea': function () {
		Modal.show('adjuntarArchivoTarea');
	}
});

Template.fullScreenTareaAsuntoDocs.helpers({
	tareas() {
		return Tareas.find({}, {sort: {createdAt: -1}});
	},
	asuntoId: () => {
    	return FlowRouter.getParam('asuntoId');
  	},
  	tareaId: () => {
    	return FlowRouter.getParam('tareaId');
  	},
  	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	archivos: () => {
		return DocumentosTareas.find({}, {sort: {createdAt: -1}});
	},
	tarea: () => {
		return Tareas.findOne({ _id: FlowRouter.getParam('tareaId') });
	},
	hayFecha: (fecha) => {
		if (fecha !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	dia() {
		var d = this.vence,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
	}
});

Template.cuadroArchivosTareas.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let tareaId = FlowRouter.getParam('tareaId');
		self.subscribe('archivosDeTareas', tareaId);
   });
});

Template.cuadroArchivosTareas.helpers({
	archivos: () => {
		return DocumentosTareas.find({}, {sort: {createdAt: -1}});
	}
});

Template.adjuntarArchivoTarea.events( {
	'submit form': function (e, t) {
		e.preventDefault();
		subirArchivoTarea(e, t);
	}
});

Template.menuTareas2.helpers({
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	},
	email() {
		return Meteor.user().emails[0].address;
	}
});

Template.menuTareas2.events({
	'click .task'(event,template){
		Modal.show('nuevaTareaAsuntoModal')
	},
	'click .agregar-etapa'(event,template){
		Modal.show('agregarEtapaModal');
	}
});



Template.agregarEtapaModal.events({
	'submit form'(event,template){
		event.preventDefault();
		let datos = {}
		datos.nombre = template.find("[name='etapa']").value;
		datos.bufeteId = Meteor.user().profile.bufeteId;
		datos.asunto= {
			id: FlowRouter.getParam('asuntoId'),
			nombre: Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].caratula
		}

		Meteor.call('agregarEtapaAsunto',datos,function (err) {
			if(err) return Bert.alert('No se pudo añadir los datos correctamente','danger');
			Bert.alert('Se añadio la etapa correctamente','success')
			Modal.hide('agregarEtapaModal')
		})
	}
})

Template.nuevaTareaAsuntoModal.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker1') });
})

Template.nuevaTareaAsuntoModal.helpers({
	miembros(){
		return Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].abogados
	},
	etapas(){
		return Etapas.find({'asunto.id':FlowRouter.getParam('asuntoId')});
	}
})

Template.nuevaTareaAsuntoModal.events({
	'click .agregar-tarea'(event,template){
		event.preventDefault();
		debugger;

		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			asunto: {
				nombre: Asuntos.find({_id:FlowRouter.getParam('asuntoId')}).fetch()[0].caratula,
				id: FlowRouter.getParam('asuntoId')
			},
			tipo: $( ".tipo" ).val(),
			bufeteId: Meteor.user().profile.bufeteId,
			asignado:{
				id: template.find('[name="miembro"]').value,
				nombre: $(template.find('[name="miembro"]')).find(":selected").html()
			},
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}		}

		if(template.find("[name='etapa']").value!=""){
			datos.etapa={
				id: template.find("[name='etapa']").value,
				nombre: template.find("[name='etapa'] :selected").innerHTML
			}
		}

		if (datos.asunto.nombre === "Elige un asunto" && datos.asunto.id === "") {
			datos.asunto.nombre = undefined;
			datos.asunto.id = undefined;
		}

		if (datos.descripcion !== "" && datos.fecha !== "") {
				Meteor.call('crearTarea', datos, function (err, result) {
				if (err) {
					console.log(err)
					Bert.alert('Error al tratar de registrar, intentelo de nuevo', 'danger');
					return;
				}

				template.find('[name="descripcion"]').value = "";
				template.find('[name="fecha"]').value = "";
				Modal.hide('nuevaTareaAsuntoModal')
				Bert.alert('Agregaste una tarea', 'success');
			});
		} else {
			Bert.alert('Ingresa los datos', 'warning');
		}

	}
})

Template.detalleTareaAsunto.events({
	'click .comentar': (e, template) => {
		debugger
		let comentario = template.find('[name="comentario"]').value;
		let datos = {
			comentario: comentario,
			tareaId: FlowRouter.getParam('tareaId'),
			bufeteId: Meteor.user().profile.bufeteId,
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}
		}
		if (comentario !== "") {
			Meteor.call('agregarComentarioATarea', datos, function (err, result) {
				debugger
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentalo', 'warning');
					template.find('[name="comentario"]').value = "";
				} else {
					console.log('¡Listo!');
					template.find('[name="comentario"]').value = "";
				}
			} );
		} else {

		}
	}
});

Template.calendario2.helpers({
	email() {
		return Meteor.user().emails[0].address;
	}
});

Template.Conversaciones.onCreated(function () {
	var self = this;
	Session.set('asunto-id',"");
	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId
    	self.subscribe('conversaciones', bufeteId);
    	self.subscribe('comentariosDeConversaciones', bufeteId);
   });
});

Template.Conversaciones.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	conversaciones() {
		return Conversaciones.find({}, {sort: {createdAt: -1}});
	}
	// comentarios() {
	// 	return ComentariosConversaciones.find({conversacionId: Template.parentData(0)._id});
	// }
});


Template.conversacionesPorAsunto.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('conversacionesAsunto', asuntoId);
    	self.subscribe('comentariosDeConversacionesAsunto', asuntoId);
   });
});

Template.conversacionesPorAsunto.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	conversaciones() {
		return ConversacionesAsunto.find({asuntoId: FlowRouter.getParam('asuntoId')/*Session.get('asunto-id')*/}, {sort: {createdAt: -1}});
	},
	comentarios() {
		return ComentariosConversacionesAsunto.find({conversacionAsuntoId: Template.parentData(0)._id});
	},
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	}
});



Template.conversacionesPorAsunto.events({
	'click .enviar-conversacion': function (event, template) {
		debugger;

		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			asuntoId: FlowRouter.getParam('asuntoId'),
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
		}

		if (datos.nombre !== "" && datos.descripcion !== "" ) {
			Meteor.call('agregarConversacionAsunto', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				} else {
					Bert.alert('Agregaste un conversacion', 'success');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				}
			});
		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	},
	'click .enviar-comentario': function (event, template) {
		let datos = {
			comentario: template.find('[name="comentario"]').value,
			asuntoId: FlowRouter.getParam('asuntoId'),
			autor: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			conversacionAsuntoId: this._id
		}

		if (datos.comentario !== "") {

			Meteor.call('agregarComentarioAConversacionAsunto', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="comentario"]').value = "";
				} else {
					template.find('[name="comentario"]').value = "";
				}
			});

		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	}
});



Template.conversacionesxcomentarios.helpers({
	comentarios() {
		return ComentariosConversaciones.find({conversacionId: Template.parentData(0)._id});
	}
});

Template.conversacionesxcomentarios.events({

	'click .enviar-comentario': function (event, template) {
		let datos = {
			comentario: template.find('[name="comentario"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			autor: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			conversacionId: this._id
		}

		debugger;

		if (datos.comentario !== "") {

			Meteor.call('agregarComentarioAConversacion', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="comentario"]').value = "";
				} else {
					template.find('[name="comentario"]').value = "";
				}
			});

		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	}
})

Template.Conversaciones.events({
	'click .enviar-conversacion': function (event, template) {
		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
		}

		if (datos.nombre !== "" && datos.descripcion !== "" ) {
			Meteor.call('agregarConversacion', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				} else {
					Bert.alert('Agregaste un conversacion', 'success');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				}
			});
		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	}
});

Template.contenidoDashboard2.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.contenidoDashboard2Bienvenido.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.detalleCalendario2.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);

   });
});

Template.detalleCalendario2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	}
});

Template.detalleConversacion2.onCreated(function () {
	var self = this;
	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
		self.subscribe('expediente', asuntoId);
    	self.subscribe('conversacionesAsunto', asuntoId);
    	self.subscribe('comentariosDeConversacionesAsunto', asuntoId);
   });
});

Template.itemConversacion.helpers({
	comentarios() {
		return ComentariosConversacionesAsunto.find({conversacionAsuntoId: Template.parentData(0)._id});
	}
})

Template.itemConversacion.events({
	'click .enviar-comentario': function (event, template) {
		let datos = {
			comentario: template.find('[name="comentario"]').value,
			asuntoId: FlowRouter.getParam('asuntoId'),
			autor: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			conversacionAsuntoId: this._id
		}

		if (datos.comentario !== "") {

			Meteor.call('agregarComentarioAConversacionAsunto', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="comentario"]').value = "";
				} else {
					template.find('[name="comentario"]').value = "";
				}
			});

		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	}
})

Template.detalleConversacion2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	conversaciones() {
		return ConversacionesAsunto.find({asuntoId: FlowRouter.getParam('asuntoId')/*Session.get('asunto-id')*/}, {sort: {createdAt: -1}});
	},

	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	}
});



Template.detalleConversacion2.events({
	'click .enviar-conversacion': function (event, template) {
		debugger;

		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			asuntoId: FlowRouter.getParam('asuntoId'),
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
		}

		if (datos.nombre !== "" && datos.descripcion !== "" ) {
			Meteor.call('agregarConversacionAsunto', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				} else {
					Bert.alert('Agregaste un conversacion', 'success');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				}
			});
		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	}
});

Template.detalleNotas2.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);

   });
});

Template.detalleNotas2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	}
});

Template.asuntoInformacion.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);

   });
});

Template.asuntoInformacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	}
});

Template.detalleFacturacion.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);

   });
});

Template.detalleFacturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	}
});

Template.clientes.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
		self.subscribe('clientes', bufeteId);
	});


})

Template.clientes2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	clientes(){
		return Clientes.find({estatus:"cliente"}).fetch().length;
	},
	prospectos(){
		return Clientes.find({estatus:"prospecto"}).fetch().length;

	},
	contactos(){
		return Clientes.find({estatus:"contacto"}).fetch().length;
	}
});

Template.cantidadClientes.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('clientes', bufeteId);
   });


});


Template.cantidadClientes.helpers({
	cantidad() {
		return Clientes.find().fetch().length;
	},
	contactos(){
		return Clientes.find({estatus:"contacto"}).count()
	}
});

Template.equipo.onCreated(function () {
		var self = this;

		self.autorun(function () {
			let bufeteId = Meteor.user().profile.bufeteId;
			self.subscribe('equipo',bufeteId);
		})
});

Template.equipo.helpers({
	email(){
			return Meteor.user().emails[0].address
	},
	emails(){
		return this.emails[0].address;
	},
	miembros(){
		return Meteor.users.find({},{sort:{createdAt:-1}});
	}

});

Template.equipo.events({
	'click .nuevo-miembro': function () {
		Modal.show('usuarioForm');
	},
	'click .nueva-area':function () {
		Modal.show('areaForm');
	},
	'click .nuevo-equipo': function () {
		Modal.show('crearEquipoModal');
	}
});

Template.equipos.events({
	'click .nuevo-miembro': function () {
		Modal.show('usuarioForm');
	},
	'click .nueva-area':function () {
		Modal.show('areaForm');
	},
	'click .nuevo-equipo': function () {
		Modal.show('crearEquipoModal');
	}
});



Template.Prospectos.onCreated(function () {
	var self = this;
	Session.set('nombre-prospecto',"");
	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('prospectos', bufeteId);
   });
});

Template.Prospectos.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	clientes() {
		var regexNombre = new RegExp(".*"+Session.get('nombre-prospecto')+".*","i");
		return Clientes.find({nombreCompleto:regexNombre,estatus: 'prospecto'}, {sort: {createdAt: -1}});
	}
});

Template.Prospectos.events({
	'keyup .buscador-prospectos'(){
		Session.set('nombre-prospecto',$(".buscador-prospectos").val())
	}
})

Template.clientesOficial.onCreated(function () {
	var self = this;
	Session.set('nombre-cliente',"")
	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('clientesOficial', bufeteId);
   });
});

Template.clientesOficial.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	clientes() {
		var regexNombre = new RegExp(".*"+Session.get('nombre-cliente')+".*","i");
		return Clientes.find({nombreCompleto:regexNombre, estatus: 'cliente'}, {sort: {createdAt: -1}});
	}
});

Template.clientesOficial.events({
	'keyup .buscador-clientes'(){
		Session.set("nombre-cliente",$(".buscador-clientes").val())
	}
})



Template.fechaTareaModal.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker4') });
})

Template.fechaTareaModal.events({
	'click .agregar-fecha'(event,template){
		var fecha = template.find('[name="fecha"]').value;
		var tareaId = this._id;
		Meteor.call('actualizarFechaTarea',tareaId, fecha,function (err) {
				if(err) Bert.alert('Hubo un error por favor intentelo nuevamente','danger')
				Bert.alert('Se actualizo la fecha correctamente','success')
				Modal.hide('fechaTareaModal')

		})

	}
});

Template.casoNuevoModal.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('clientes', bufeteId);
   });
});

Template.casoNuevoModal.helpers({
	contactos() {
		return Clientes.find({}, {sort: {createdAt: -1}});
	}
});

Template.casoNuevoModal.events({
	'click .guardar-caso': function (event, template) {
		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			createdAt: new Date(),
			contacto: {
				nombre: $( ".cliente option:selected" ).text(),
				id: $('select[name=clienteselect]').val()
			},
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}
		};

		if (datos.nombre !== "") {
			Meteor.call('agregarCaso', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un error, vuelve a intentelo', 'warning');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				} else {
					Bert.alert('Agregaste un nuevo caso', 'success');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				}
			});
		} else {
			Bert.alert('Por favor completa los datos correctamente', 'warning');
		}
	}
});

Template.venceTareaModal.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker4') });
})

Template.venceTareaModal.events({
	'click .agregar-fecha'(event,template){
		var fecha = template.find('[name="fecha"]').value;
		var tareaId = FlowRouter.getParam('tareaId');
		Meteor.call('actualizarFechaTarea',tareaId, fecha,function (err) {
				if(err) Bert.alert('Hubo un error por favor intentelo nuevamente','danger')
				Bert.alert('Se actualizo la fecha correctamente','success')
				Modal.hide('fechaTareaModal')
		});

	}
})


Template.tareaEspecifica.helpers({
	dia(fecha) {
		var d = new Date(fecha),
				minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
				hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
				ampm = d.getHours() >= 12 ? 'pm' : 'am',
				months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'],
				days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	esMiTarea() {
		if (this.asignado.id === Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	},
	estaAbierto() {
		if (this.abierto === true) {
			return true;
		} else {
			return false;
		}
	}
})

Template.tareaEspecifica.events({
	'click .agregar-fecha-tarea'(){
		Modal.show('fechaTareaModal',this)
	},
	'click .agregar-asunto-tarea'(){
		Modal.show('asuntoTareaModal',this);
	},
	'click .agregar-miembro-tarea'(){
		Modal.show('miembroTareaModal',this);
	}
})

Template.asuntoTareaModal.onCreated(function () {
	var self = this;
	Session.get('asunto-id',"")
	self.autorun(function () {
		let id = Meteor.user()._id;
		let bufeteId = Meteor.user().profile.bufeteId;
		self.subscribe('etapasxbufete',bufeteId)
		self.subscribe('asuntosxequipo',id,bufeteId);
	})
})

Template.asuntoTareaModal.helpers({
	asuntos(){
		return Asuntos.find({abierto:true});
	},
	etapas(){
		if(Session.get("asunto-tarea-id")===""||Session.get("asunto-id")===undefined) return Etapas.find({});

		return Etapas.find({'asunto.id':Session.get("asunto-id")})
	}
})


Template.miembroTareaModal.onCreated(function () {
		var self = this;

		if(self.asunto) Session.set('asunto-tarea-id',self.asunto.id);
		else Session.set('asunto-tarea-id',"");

		self.autorun(function () {

		})
})

Template.miembroTareaModal.helpers({
	miembros(){
		console.log('entro aqui')
		debugger;
		if(Session.get("asunto-tarea-id")===""||Session.get("asunto-tarea-id")===undefined) return Meteor.users.find();

		var n = Asuntos.find({_id:Session.get("asunto-tarea-id")}).fetch()[0].abogados.length
		if(n==0) return Meteor.users.find();

		return Asuntos.find({_id:Session.get("asunto-tarea-id")}).fetch()[0].abogados;
	},
	nombre(){
		if(this.profile!==undefined) return this.profile.nombre;
		return this.nombre;
	},
	apellido(){
		if(this.profile!==undefined) return this.profile.apellido;
		return;
	},
	id(){
		if(this.profile!==undefined) return this._id;
		return this.id;
	}
})

Template.miembroTareaModal.events({
	'click .agregar-miembro-tarea'(event,template){
		let tareaId = this._id,
				asignado = {
					id: template.find("[name='miembro-tarea']").value,
					nombre: $(template.find('[name="miembro-tarea"]')).find(":selected").html()
				};

		Meteor.call('actualizarMiembroTarea',tareaId,asignado,function (err) {
			if(err) return Bert.alert('Hubo un error al momento de crear, intentelo de nuevo','danger')
			Bert.alert('Se asigno correctamente el miembro a la tarea','success');
			Modal.hide('asuntoTareaModal')
		})
	}
})

Template.asuntoTareaModal.events({
	'click .agregar-asunto-tarea'(event,template){
		debugger;
		let datos = {
			tareaId : this._id,
			asunto : {
				id: template.find("[name='asunto-tarea']").value,
				nombre: $(template.find('[name="asunto-tarea"]')).find(":selected").html()
			},
			etapa:{
				id: template.find("[name='etapa-tarea']").value,
				nombre: $(template.find('[name="etapa-tarea"]')).find(":selected").html()
			}
		}

		Meteor.call('actualizarAsuntoTarea',datos,function (err) {
				if(err) return Bert.alert('Hubo un error al momento de crear, intentelo de nuevo','danger')
				Bert.alert('Se asigno correctamente el asunto a la tarea','success');
				Modal.hide('asuntoTareaModal')
		})
	},
	'change [name="asunto-tarea"]'(event,template){
		Session.set("asunto-id",event.target.value);
	}
})

Template.listaEmpresas.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('empresas', bufeteId);
   });
});

Template.listaEmpresas.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	empresas() {
		return Empresas.find({}, {sort: {createdAt: -1}});
	}
});

Template.detalleClientes2.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let _id = FlowRouter.getParam('_id');
    	self.subscribe('contacto', _id);
    	self.subscribe('conversacionesNota', _id, Meteor.user().profile.bufeteId);
   });
});

Template.detalleClientes2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	cliente() {
		return Clientes.findOne({_id: FlowRouter.getParam('_id')});
	},
	contactoId() {
		return FlowRouter.getParam('_id');
	},
	notas() {
		return ConversacionesNota.find({}, {sort: {createdAt: -1}});
	}
});

Template.casos.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('casos2', bufeteId);
   });
});

Template.casos.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	casos() {
		return Casos.find({}, {sort: {createdAt: -1} });
	},
	dia(fecha) {
		var d = new Date(fecha),
				minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
				hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
				ampm = d.getHours() >= 12 ? 'pm' : 'am',
				months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'],
				days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	}
});

Template.casoDetalle.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('casos2', bufeteId);
    	let casoId = FlowRouter.getParam('casoId');
    	self.subscribe('newsCasos', casoId);
   });
});

Template.statusNegociacion.events({
	'click .cerrado': function () {
		var status = "cerrado";
		var casoId = FlowRouter.getParam('casoId');
		Meteor.call('actualizarStatusCaso', casoId, status, function (err) {
			if (err) {
				Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
			} else {
				Bert.alert('Ganaste la negociación', 'success');
			}
		});
	},
	'click .abierto': function () {
		var status = "abierto"
		var casoId = FlowRouter.getParam('casoId');
		Meteor.call('actualizarStatusCaso', casoId, status, function (err) {
			if (err) {
				Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
			} else {
				Bert.alert('La negociación sigue en ejecución', 'success');
			}
		});
	},
	'click .no-resuelto': function () {
		var status = "no resuelto"
		var casoId = FlowRouter.getParam('casoId');
		Meteor.call('actualizarStatusCaso', casoId, status, function (err) {
			if (err) {
				Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
			} else {
				Bert.alert('Perdiste la negociación', 'success');
			}
		});
	}
});

Template.statusNegociacion.helpers({
	color: function () {
		if (this.estatus === "abierto") {
			return "morado-flat"
		} else if (this.estatus === "cerrado") {
			return "green"
		} else {
			return "rojo-flat"
		}
	}
});

Template.pieChart.onCreated(function () {

	var self = this;

	self.autorun(function() {
    	self.subscribe('slices');

   });

	Session.setDefault('pieChartSort','none');
	Session.setDefault('pieChartSortModifier',undefined);
});



Template.pieChart.onRendered(function(){


		function chartLine(){

			var ctx4 = document.getElementById("myChart4").getContext("2d");

			var data4 = [
				{
						value: Clientes.find({estatus:"contacto"}).count(),
						color:"#27ae60",
						highlight: "#2ecc71",
						label: "Contactos"
				},
				{
						value: Clientes.find({estatus:'prospecto'}).count(),
						color: "#8e44ad",
						highlight: "#9b59b6",
						label: "Prospectos"
				},
				{
						value: Clientes.find({estatus:'cliente'}).count(),
						color: "#c0392b",
						highlight: "#e74c3c",
						label: "Clientes"
				}]

				let myPieChart = new Chart(ctx4).Pie(data4,{
						animateScale: true
				});

		}

		Tracker.autorun(chartLine);
});

Template.casoDetalle.helpers({
	caso() {
		return Casos.findOne({_id: FlowRouter.getParam('casoId')});
	},
	email() {
		return Meteor.user().emails[0].address
	},
	news() {
		return NewsFeedCasos.find({}, {sort: {createdAt: -1}});
	},
	dia(fecha) {
		debugger;

		var d = new Date(fecha),
				minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
				hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
				ampm = d.getHours() >= 12 ? 'pm' : 'am',
				months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
				days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	casoId() {
		return FlowRouter.getParam('casoId');
	}
});

Template.casoNotas.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
		let casoId = FlowRouter.getParam('casoId');
    	self.subscribe('casos2', bufeteId);
    	self.subscribe('casosNotas', casoId);

   });
});

Template.casoNotas.helpers({
	caso() {
		return Casos.findOne({_id: FlowRouter.getParam('casoId')});
	},
	email() {
		return Meteor.user().emails[0].address
	},
	dia(fecha) {
		debugger;

		var d = new Date(fecha),
				minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
				hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
				ampm = d.getHours() >= 12 ? 'pm' : 'am',
				months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
				days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	casoId() {
		return FlowRouter.getParam('casoId');
	},
	notas() {
		return NotasCasos.find({}, {sort: {createdAt: -1}});
	}
});

Template.casoNotas.events({
	'click .agregar-nota': (event, template) => {
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			createdAt: new Date(),
			caso: {
				nombre: $('a.caso-nombre').text(),
				id: FlowRouter.getParam('casoId')
			},
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}
		}

		if (datos.descripcion !== "") {

			Meteor.call('agregarNotaCaso', datos, function (err, result) {
				if (err) {
					template.find('[name="descripcion"]').value = "";
					Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
				} else {
					template.find('[name="descripcion"]').value = "";
					Bert.alert('Agregaste una nota en el caso', 'success');
				}
			});

		} else {
			template.find('[name="descripcion"]').value = "";
			Berta.alert('Por favor ingresa los datos correctamente', 'warning');
		}
	}
});

Template.casoTareas.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
		let casoId = FlowRouter.getParam('casoId');
    	self.subscribe('casos2', bufeteId);
			self.subscribe('TareasxNegociacion', casoId);

   });
});



Template.casoTareas.helpers({
	caso() {
		return Casos.findOne({_id: FlowRouter.getParam('casoId')});
	},
	email() {
		return Meteor.user().emails[0].address
	},
	dia(fecha) {
		debugger;

		var d = new Date(fecha),
				minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
				hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
				ampm = d.getHours() >= 12 ? 'pm' : 'am',
				months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
				days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	casoId() {
		return FlowRouter.getParam('casoId');
	},
	tareas: function () {
		return TareasNegociaciones.find({}, {sort: {createdAt: -1} });
	},
	responsable: function () {
		if (this.asignado.nombre === Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido) {
			return "Tú"
		} else {
			return this.asignado.nombre
		}
	},
	checked: function () {
		if (this.abierto === true) {
			return "";
		} else if (this.abierto === false) {
				return "checked";
		}
	}
});

Template.casoTareas.events({
	'keyup [name="tarea"]': function (e, t) {
			if (e.which == 13) {
				let datos = {
					descripcion: t.find("[name='tarea']").value,
					casoId: FlowRouter.getParam('casoId'),
					asignado: {
						nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
						id: Meteor.userId()
					}
				}

				Meteor.call('crearTareaCRMRapido', datos, function (e, r) {
					if (e) {
						Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
					} else {
						Bert.alert('Agregaste la tarea en la negociación', 'success');
						t.find("[name='tarea']").value = "";
					}
				});
			}
	},
	'click .tarea-crm': function () {
		if (this.abierto === true) {
				Meteor.call('cerrarTareaCRM', this._id, function (error) {
					if (error) {
						Bert.alert('Hubo un error, vuevle a intentarlo', 'warning');
					} else {
						Bert.alert('Completaste la tarea', 'success');
					}
				});
		} else if (this.abierto === false) {
			Meteor.call('abrirTareaCRM', this._id, function (error) {
				if (error) {
					Bert.alert('Hubo un error, vuevle a intentarlo', 'warning');
				} else {
					Bert.alert('Abriste la tarea', 'success');
				}
			});
		}
	}
});

Template.notaCliente.onCreated(function () {

	let self = this;
	self.autorun(function () {
		let _id = FlowRouter.getParam('_id');
		self.subscribe('comentariosDeConversacionesNota', _id);
	})


})

Template.notaCliente.helpers({
	comentarios() {
		debugger;
		return ComentariosNotas.find({notaId: Template.parentData(0)._id});
	}
})

Template.notaCliente.events({

	'click .enviar-comentario': function (event, template) {
		let datos = {
			comentario: template.find('[name="comentario"]').value,
			contactoId: FlowRouter.getParam('_id'),
			autor: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			notaId: this._id
		}

		if (datos.comentario !== "") {

			Meteor.call('agregarComentarioAConversacionNota', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="comentario"]').value = "";
				} else {
					template.find('[name="comentario"]').value = "";
				}
			});

		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	}
})

Template.detalleClientes2.events({
	'click .enviar-conversacion': function (event, template) {
		let datos = {
			nombre: template.find('[name="nombre"]').value,
			descripcion: template.find('[name="descripcion"]').value,
			contactoId: FlowRouter.getParam('_id'),
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
			bufeteId: Meteor.user().profile.bufeteId
		}

		if (datos.nombre !== "" && datos.descripcion !== "" ) {
			Meteor.call('agregarConversacionNota', datos, function (err, result) {
				if (err) {
					Bert.alert('Hubo un problema, por favor vuelve a intentarlo', 'warning');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				} else {
					Bert.alert('Agregaste una nota', 'success');
					template.find('[name="nombre"]').value = "";
					template.find('[name="descripcion"]').value = "";
				}
			});
		} else {
			Bert.alert('Ingresa los datos correctamente', 'warning');
		}
	}
});


Template.detalleClientesInfo.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let _id = FlowRouter.getParam('_id');
    	self.subscribe('contacto', _id);

   });
});

Template.detalleClientesInfo.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	cliente() {
		return Clientes.findOne({_id: FlowRouter.getParam('_id')});
	},
	contactoId() {
		return FlowRouter.getParam('_id');
	}
});

Template.detalleClientesCasos.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let _id = FlowRouter.getParam('_id');
    	self.subscribe('contacto', _id);

   });
});

Template.detalleClientesCasos.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	cliente() {
		return Clientes.findOne({_id: FlowRouter.getParam('_id')});
	},
	contactoId() {
		return FlowRouter.getParam('_id');
	}
});

Template.detalleClientesAsuntos.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let _id = FlowRouter.getParam('_id');
    	self.subscribe('contacto', _id);

   });
});

Template.detalleClientesAsuntos.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	cliente() {
		return Clientes.findOne({_id: FlowRouter.getParam('_id')});
	},
	contactoId() {
		return FlowRouter.getParam('_id');
	}
});

Template.detalleClientesFacturacion.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let _id = FlowRouter.getParam('_id');
    	self.subscribe('contacto', _id);

   });
});

Template.detalleClientesFacturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	cliente() {
		return Clientes.findOne({_id: FlowRouter.getParam('_id')});
	},
	contactoId() {
		return FlowRouter.getParam('_id');
	},
});




Template.miembrosxequipo.helpers({
	miembros(){

		return _(Equipos.find().fetch()[0].miembros).map(function (miembro) {
			return {
				id:miembro.id,
				nombre: miembro.nombre,
				telefono: Meteor.users.find({_id:miembro.id}).fetch()[0].profile.telefono,
				email: Meteor.users.find({_id:miembro.id}).fetch()[0].emails[0].address,
			}
		});
	},
	email(){
		return Meteor.user().emails[0].address;
	},
	miequipo(){
		return Equipos.find().fetch()[0].nombre;
	}

})

Template.miembrosxequipo.onCreated(function () {
	let bufeteId = Meteor.user().profile.bufeteId;
	let self = this;
	self.autorun(function () {
		self.subscribe('miequipo',FlowRouter.getParam('equipoId'))
	})
})

Template.equipos.onCreated(function () {
	let bufeteId = Meteor.user().profile.bufeteId;
	let self = this;
	self.autorun(function () {
		self.subscribe('misequipos',bufeteId)
	})

})

Template.equipos.helpers({
	email(){
		return Meteor.user().emails[0].address;
	},
	equipos(){
		return Equipos.find()
	}
})


// Mi Ccalendario Personal

let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};

Template.miCalendario.onRendered( function ()  {
	 $( '#calendario' ).fullCalendar({
	 	lang: 'es',
	 	header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
    	defaultView: 'agendaWeek',
    	events( start, end, timezone, callback ) {

      		let data = MiCalendario.find().fetch().map( ( event ) => {
        		//event.editable = true //!isPast( event.start );
        		return event;
      		});

    		if ( data ) {
        		callback( data );
      		}
    	},
    	/*eventRender( event, element ) {
			console.log(event);

			if (event.tarea.id !== undefined) {
				let tarea =  Tareas.findOne({_id:event.tarea.id});
				let abierto = false;
				if(tarea) abierto = tarea.abierto;

				console.log("[R]" + abierto);
				let title = abierto? '<h5>' + event.title +'</h5>' : '<h5> <i class="fa fa-check"> </i> ' + event.title + '</h5>';

      			element.find( '.fc-content' ).html(title);
			} else {
				console.log('funciona :,)');
			}



    	}*/
	 });

	 this.autorun( () => {
    	MiCalendario.find().fetch();
    	$( '#calendario' ).fullCalendar( 'refetchEvents' );
  	});
});

Template.miCalendario.onCreated(function () {

	var self = this;

	self.autorun(function () {

		self.subscribe('miCalendario');
	});

});

Template.miCalendario.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

let closeModal = () => {
  $( '#add-edit-event-modal' ).modal( 'hide' );
  $( '.modal-backdrop' ).fadeOut();
};


Template.addEditEventModal.events({
  'submit form' ( event, template ) {
    event.preventDefault();

    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent',
        eventItem  = {
          title: template.find( '[name="title"]' ).value,
          start: template.find( '[name="start"]' ).value,
          end: template.find( '[name="end"]' ).value,
          type: template.find( '[name="type"] option:selected' ).value,
          bufeteId: Meteor.user().profile.bufeteId
        };

    if ( submitType === 'editEvent' ) {
      eventItem._id   = eventModal.event;
    }

    Meteor.call( submitType, eventItem, ( error ) => {
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
        closeModal();
      }
    });
  },
   'click .delete-event' ( event, template ) {
    	let eventModal = Session.get( 'eventModal' );

    	if ( confirm( '¿Seguro que deseas eliminar este evento? Esto sera permanente.' ) ) {
      		Meteor.call( 'removeEvent', eventModal.event, ( error ) => {
        		if ( error ) {
          			Bert.alert( error.reason, 'danger' );
        		} else {
          			Bert.alert( 'Event deleted!', 'success' );
          			closeModal();
        		}
      		});
    	}
  	}
});

Template.addEditEventModal.helpers({
  modalType( type ) {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    }
  },
  modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type === 'edit' ? 'Edit' : 'Add',
        label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  selected( v1, v2 ) {
    return v1 === v2;
  },
  event() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return eventModal.type === 'edit' ? MiCalendario.findOne( eventModal.event ) : {
        start: eventModal.date,
        end: eventModal.date
      };
    }
  }
});

// Logica del NewsFeed para CRM

Template.newsCRM.onCreated(function () {
	var self = this;

	this.limite = new ReactiveVar(7);


	self.autorun(function () {

		let bufeteId = Meteor.user().profile.bufeteId;

		self.subscribe('newsCRM', bufeteId, self.limite.get());
	});

});

Template.newsCRM.helpers({
	dia() {
		var d = new Date(),
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	},
	news: () => {
		return NewsFeedCasos.find({}, {sort: {createdAt: -1} });
	},
	haynews: () => {
		if ( NewsFeedCasos.find().fetch().length > 8 ) {
			return true;
		} else {
			return false;
		}
	},
	sucedio(createdAt) {

		var d =  createdAt,
        dformat = [	d.getDate().padLeft(),
        			(d.getMonth()+1).padLeft(),
                    d.getFullYear()].join('/')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft()].join(':');

    	return dformat;
	}
});

function random() {
    return Math.floor((Math.random() * 100) + 1);
}


Template.resumenFacturacion.helpers({
	email() {

		return Meteor.user().emails[0].address
	}
});

Template.lineaChartFacturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

// Logica de cliente para hacer el chart de tipo bar

Template.barChart.onCreated(function () {

	var self = this;

	self.autorun(function() {
		self.subscribe('bars');
	});


	Session.setDefault('barChartSort','none');
	Session.setDefault('barChartSortModifier',undefined);
});

Template.barChart.events({
	'click #add':function(){
		Meteor.call('add-bar', function (error, result) {});
	},
	'click #remove':function(){
		Meteor.call('remove-bar', function (error, result) {});
	},
	'click #randomize':function(){
		Meteor.call('random-bar', function (error, result) {});
	},
	'click #toggleSort':function(){
		if(Session.equals('barChartSort', 'none')){
			Session.set('barChartSort','asc');
			Session.set('barChartSortModifier',{sort:{value:1}});
		}else if(Session.equals('barChartSort', 'asc')){
			Session.set('barChartSort','desc');
			Session.set('barChartSortModifier',{sort:{value:-1}});
		}else{
			Session.set('barChartSort','none');
			Session.set('barChartSortModifier',{});
		}
	},
	'click rect':function(event, template){
		//alert('you clicked a bar for document with _id=' + $(event.currentTarget).data("id"));
	}
});


Template.barChart.onRendered(function(){
	let self = this;

	let bufeteId = Meteor.user().profile.bufeteId;
	self.autorun(function() {
		self.subscribe('estadisticasCasos',bufeteId)
	});

	// Set the options
	function barchart () {

		var options = {

			///Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines: true,

			//String - Colour of the grid lines
			scaleGridLineColor: "rgba(0,0,0,.05)",

			//Number - Width of the grid lines
			scaleGridLineWidth: 1,

			//Boolean - Whether to show horizontal lines (except X axis)
			scaleShowHorizontalLines: true,

			//Boolean - Whether to show vertical lines (except Y axis)
			scaleShowVerticalLines: true,

			//Boolean - Whether the line is curved between points
			bezierCurve: true,

			//Number - Tension of the bezier curve between points
			bezierCurveTension: 0.4,

			//Boolean - Whether to show a dot for each point
			pointDot: true,

			//Number - Radius of each point dot in pixels
			pointDotRadius: 4,

			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth: 1,

			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			pointHitDetectionRadius: 20,

			//Boolean - Whether to show a stroke for datasets
			datasetStroke: true,

			//Number - Pixel width of dataset stroke
			datasetStrokeWidth: 2,

			//Boolean - Whether to fill the dataset with a colour
			datasetFill: true,

			display:true,

			//String - A legend template
			legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		};


		var data_cerrado = [],
			data_abierto=[],
			data_no_resuelto=[];

		for (var i = 1; i <= 12; i++) {
			let caso = Casos.find({"id.month":i,"id.estatus":"cerrado"});
			if(caso.count()!=0) data_cerrado.push(caso.fetch()[0].count)
			else data_cerrado.push(0)
		}

		for (var i = 1; i <= 12; i++) {
			let caso = Casos.find({"id.month":i,"id.estatus":"abierto"});
			if(caso.count()!=0) data_abierto.push(caso.fetch()[0].count)
			else data_abierto.push(0)
		}

		for (var i = 1; i <= 12; i++) {
			let caso = Casos.find({"id.month":i,"id.estatus":"no resuelto"});
			if(caso.count()!=0) data_no_resuelto.push(caso.fetch()[0].count)
			else data_no_resuelto.push(0)
		}

		debugger;


	    // Set the data
	    var data = {
	        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre", "Octubre","Noviembre","Diciembre"],
	        datasets: [{
	            label: "Abiertos",
	            fillColor: "rgba(155, 89, 182,1.0)",
	            pointHighlightStroke: "rgba(142, 68, 173,1.0)",
	            data: data_abierto
	        },{
	            label: "Cerrados",
	            fillColor: "rgba(46, 204, 113,1.0)",
	            pointHighlightStroke: "rgba(39, 174, 96,1.0)",
	            data: data_cerrado
	        },{
	            label: "No resueltos",
	            fillColor: "rgba(231, 76, 60,1.0)",
	            pointHighlightStroke: "rgba(192, 57, 43,1.0)",
	            data: data_no_resuelto
	        }]
	    };

		let ctx  = document.getElementById("myChart").getContext("2d");
		var myLineChart = new Chart(ctx).Bar(data, options);
	}

	setTimeout(function () {
		Tracker.autorun(barchart)
	},1000)

});

Template.detalleMiembroEquipo.onCreated(function () {
	var self = this;


	self.autorun(function() {
		let miembroId = FlowRouter.getParam('miembroId')
		self.subscribe('miembroDelEquipo', miembroId)

	});

});

Template.detalleMiembroEquipo.helpers({
	miembro() {
		return Meteor.users.findOne({_id: FlowRouter.getParam('miembroId')});
	},
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.facturacionConfiguracion.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	tarifas(){
		return Tarifas.find();
	}
});

Template.facturacionConfiguracion.onRendered(function () {
	let self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	self.autorun(function () {
		self.subscribe('tarifas',bufeteId);
	})
})

Template.cambioConfiguracion.onRendered(function () {
	let self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	self.autorun(function () {
		self.subscribe('cambios',bufeteId)
	})
})

Template.cambioConfiguracion.helpers({
	email(){
		return Meteor.user().emails[0].address
	},
	cambio(){
		return Cambio.find();
	}

})

Template.formularioParaCrearTarifa.onCreated(function () {

	let self = this;
	let bufeteId = Meteor.user().profile.bufeteId;

	self.autorun(function () {
		self.subscribe('equipo',bufeteId);
		self.subscribe('cambios',bufeteId);
	})


})


Template.formularioParaCrearTarifa.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
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


Template.formularioParaCrearTarifa.events({
	'click .cambio'(){
		Modal.show('agregarTipoCambio')
	},
	'keyup .valor-soles'(event,template){
		if(Cambio.find().count()!=0){
			debugger;
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
			debugger;
			let dolar= (event.target.value / Cambio.find().fetch()[0].cambio).toFixed(2);
			event.target.parentElement.parentElement.querySelector('.valor-dolares-miembro').value = dolar ;
			return;
		}

		Bert.alert('No se ha añadido algun tipo de cambio','danger');

	},
	'click .registrar-tarifa'(event,template){
		debugger;
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
			});
		} else {
			Bert.alert('Ingresa el nombre de la tarifa','warning');
		}

	}
});





Template.trelloLikeTareas.onCreated(function () {
	let self = this;

	self.autorun(function () {
		let asuntoId = FlowRouter.getParam('asuntoId');
		self.subscribe('etapasTrello', asuntoId);
		self.subscribe('tareasTrello', asuntoId);
		self.subscribe('expediente', asuntoId);
		self.subscribe('MisSubtareas', Meteor.user().profile.bufeteId);
		self.subscribe('MisComentariosDeTareas', Meteor.user().profile.bufeteId);
		self.subscribe('MisDocumentosDeTareas', Meteor.user().profile.bufeteId);
	});

});

Template.trelloLikeTareas.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	etapas() {
		return Etapas.find({});
	},
	tareas(etapaId) {
		return Tareas.find({'etapa.id': etapaId}, {sort: {createdAt: -1}});
	},
	borde(tipo) {
		if (tipo === "General") {
			return 'borde-general'
		} else if (tipo === "Comunicaciones") {
			return 'borde-comunicaciones'
		} else if (tipo === "Escritos") {
			return 'borde-escritos'
		} else if (tipo === "Tribunales") {
			return 'borde-tribunales'
		} else if (tipo === "Facturacion") {
			return 'borde-facturacion'
		} else {
			return 'borde-normal'
		}
	},
	expediente: () => {
		return Asuntos.findOne({_id: FlowRouter.getParam('asuntoId')});
	},
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
	},
	asignadoA() {
		if (this.asignado.nombre === Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido) {
			return "Tú"
		} else {
			return this.asignado.nombre
		}
	},
	esMiTarea() {
		if (this.asignado.id === Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	},
	documentos(){
		return DocumentosTareas.find({'metadata.tareaId':this._id}).fetch().length;
	},
	subtareas(){
		return Subtareas.find({tareaId:this._id}).fetch().length;
	},
	comentarios(){
		return ComentariosDeTareas.find({tareaId:this._id}).fetch().length;
	},
	dia(date) {
		var d = date,
    	// minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	// hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	// ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	checked: function () {
		if (this.abierto === true) {
			return "";
		} else if (this.abierto === false) {
			return "checked";
		}
	}
});

Template.trelloLikeTareas.events({
	'keyup [name="tarea-nueva"]': function (event, template) {

		if(event.which == 13) {

			let datos = {
			etapa: {
				nombre: this.nombre,
				id: this._id
			},
			bufeteId: Meteor.user().profile.bufeteId,
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
			},
			asunto: {
				id: FlowRouter.getParam('asuntoId')
			}
			}

			$( ".kanban-input" ).each(function( index ) {

			if ( $( this ).val()  !== "") {
				datos.descripcion = $( this ).val();
				$( this ).val("");
			}

			});


        	template.find('[name="tarea-nueva"]').value = "";
        	Meteor.call('crearTareaKanban', datos, function (err, result) {
			//	debugger;
        		if (err) {
        			Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        			template.find('[name="tarea-nueva"]').value = "";
        		} else {
        			template.find('[name="tarea-nueva"]').value = "";
        			Bert.alert('Agregaste una tarea', 'success');
        		}
        	});
    	}
	},
	'click .ir-detalle': () => {
		console.log(this._id);
		//FlowRouter.go('/tareas/' + this._id);
	},
	'click .establecer-fecha'(event,template){
		Modal.show('fechaTareaModal',this)
	},
	'change [name="checkbox"]': function () {
			if (this.abierto === true) {
				Meteor.call('cerrarTarea', this._id, function (err) {
					if (err) {
						Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
					} else {
						Bert.alert('Completaste la tarea', 'success');
					}
				});
			} else if (this.abierto === false) {
				Meteor.call('abrirTarea', this._id, function (err) {
					if (err) {
						Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
					} else {
						Bert.alert('Desmarcaste la tarea', 'success');
					}
				});
			}
	},
	'keyup .etapa-input': function (event, template) {

		if(event.which == 13) {

				let datos = {
						id: this._id
				}

				datos.nombre = template.find(`[name="${this._id}"]`).value;

				Meteor.call('actualizarNombreEtapa', datos, function (err) {
					if (err) {
						Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
					} else {
						Bert.alert('Actualizaste el nombre de la etapa', 'success');
					}
				});

    	}
	}
});

Template.miCalendario.events({
	'click .crear'() {
		Modal.show('modalNuevoEvento');
	}
});

Template.modalNuevoEvento.onRendered(function () {
	var picker = new Pikaday({ field: document.getElementById('datepicker1') });
	var picker2 = new Pikaday({ field: document.getElementById('datepicker2') });
});

Template.modalNuevoEvento.events({
	'click .agregar-evento': function (e, t) {
		let datos = {
			title: t.find("[name='descripcion']").value,
			type: $( "#type option:selected" ).text()
		}

	datos.start = t.find("[name='empieza']").value;
	if (t.find("[name='finaliza']").value === "") {
		datos.end = datos.start;
	} else {
		datos.end = t.find("[name='finaliza']").value;
	}


	datos.horai = $( "#horai" ).val() ;
	datos.minutoi = $( "#minutoi" ).val();

	datos.horaf = $( "#horaf" ).val();
	datos.minutof = $( "#minutof" ).val();

		if (datos.title !== "" && datos.start !== "" && datos.end !== "") {
			Meteor.call('agregarNuevoEvento', datos, function (err) {
				if (err) {
					Bert.alert('Hubo un error, vuevle a intentarlo', 'warning');
				} else {
					Modal.hide('modalNuevoEvento');
					Bert.alert('Agregaste un nuevo evento', 'success');

				}
			});
		}
	}
});
