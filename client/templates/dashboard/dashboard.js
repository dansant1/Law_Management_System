Template.teamSidebarDahboard.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
   });
});

Template.tareas2.onCreated(function () {
		var self = this;

		Session.set('tipo-tarea',true);

		self.autorun(function () {
			self.subscribe('misTareas')
		})
});



Template.tareas2.helpers({
	tareas(){
		return Tareas.find({"$and":[
			{'asignado.id':Meteor.userId()},
			{abierto:Session.get('tipo-tarea')}
		]}, {sort: {createdAt: -1}})
	},
	cantidad(){
		return Tareas.find({"$and":[
			{'asignado.id':Meteor.userId()},
			{abierto:Session.get('tipo-tarea')}
		]}).count()
	},

	tipo(){
		let tipo = Session.get('tipo-tarea')? 'abiertas' : 'cerradas';
		return tipo;
	},
	email() {
		return Meteor.user().emails[0].address
	},
	esMiTarea() {
		if (this.asignado.id === Meteor.userId()) {
			return true;
		} else {
			false;
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

Template.nuevaTareaModal.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let id = Meteor.user()._id;

		let bufeteId = Meteor.user().profile.bufeteId;

		self.subscribe('asuntosxequipo',id, bufeteId);
	});
});

Template.tareasGantt.onCreated(function () {
	var self = this;

	self.autorun(function() {
		self.subscribe('TareasGantt');
		self.subscribe('LinksGantt');
	});
});

Template.tareasGantt.events({});

Template.tareasGantt.onRendered(() => {

	gantt.locale = {
		date: {
			month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
			month_short: ["Ene", "Feb", "Mar", "Abr", "Mayo", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
			day_full: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
			day_short: ["Dom", "Lun", "Mar", "Mierc", "Jue", "Vier", "Sab"]
		},
		labels:{
			new_task:"Tarea nueva",
			icon_save:"agregar",
			icon_cancel:"cancelar",
			icon_details:"detalles",
			icon_edit:"Modificar",
			icon_delete:"Eliminar",
			confirm_closing:"",//Vos modifications seront perdus, êtes-vous sûr ?
			confirm_deleting:"¿Seguro que deseas eliminar la tarea?",

			section_description:"Descripción",
			section_time:"Periodo",
			section_type:"Tipo",

			/* grid columns */

			column_text :  "Asuntos",
			column_start_date : "Inició",
			column_duration : "Duración",
			column_add : "",


			/* link confirmation */

			type_task: "Tarea",
			type_project: "Projecto",
			type_milestone: "Hito",


			minutes: "Minutos",
			hours: "Horas",
			days: "Dias",
			weeks: "Semanas",
			months: "Meses",
			years: "Años"
		}
	};
	var scale_day = 0;

	gantt.templates.date_scale = function(date) {
		var d = gantt.date.date_to_str("%F %d");
		return "<strong>Día " + (scale_day++) + "</strong><br/>" + d(date);
	};

	gantt.config.scale_height = 44;



	//gantt.config.scale_unit = "week";
	//gantt.config.date_scale = "Week #%W";

	gantt.templates.scale_cell_class = function(date) {
		if(date.getDay()==0||date.getDay()==6){
			return "weekend";
		}
	};

	gantt.templates.task_cell_class = function(item,date) {
		if(date.getDay()==0||date.getDay()==6){
			return "weekend" ;
		}
	};

	gantt.init("gantt_here");

	gantt.meteor({tasks: TasksCollection, links: LinksCollection});
});



Template.nuevaTareaModal.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });

	Session.set("asunto-id","")

});

Template.nuevaTareaModal.helpers({
	asuntos: function () {
		return Asuntos.find({abierto:true});
	},
	miembros: function () {
		debugger;

		if(Session.get("asunto-id")===""||Session.get("asunto-id")===undefined) return Meteor.users.find();

		var n = Asuntos.find({_id:Session.get("asunto-id")}).fetch()[0].abogados.length
		if(n==0) return Meteor.users.find();

		return Asuntos.find({_id:Session.get("asunto-id")}).fetch()[0].abogados;
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
});

Template.nuevaTareaModal.events({
	'click .agregar-tarea': function (events, template) {
		events.preventDefault();
		debugger;
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			asunto: {
				nombre: $( ".asunto option:selected" ).text(),
				id: $( ".asunto" ).val()
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

				} else {
					template.find('[name="descripcion"]').value = "";
					template.find('[name="fecha"]').value = "";
					Bert.alert('Agregaste una tarea', 'success');
					FlowRouter.go('/tareas');
				}
			});
		} else {
			Bert.alert('Ingresa los datos', 'warning');
		}
	},
	'change .asunto'(event,template){
		console.log('dadassa')
		Session.set("asunto-id",$(event.target).val())
	}

});



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

Template.tareas2.events({
	'click .abiertos'(){
		Session.set('tipo-tarea',true)
	},
	'click .cerrados'(){
		Session.set('tipo-tarea',false)
	},
	'click .nuevas-tareas'(){
		Modal.show('nuevaTareaModal')
	},
	'click .cerrar': function () {
		console.log('listo!');

		Meteor.call('cerrarTarea', this._id, function (err, result) {
			if (err) {
				Bert.alert('Algo salio mal', 'warning');
			} else {
				Bert.alert('Cerraste una tarea', 'success');
			}
		});

	},
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
	}
});


Template.tareasSidebarDashboard.onCreated(function () {
	var self = this;

	self.autorun(function() {

    	self.subscribe('misTareas');
   });
});

Template.tareasSidebarDashboard.helpers({
	tareas() {
		return Tareas.find({'asignado.id': Meteor.userId(), abierto: true});
	},
	hayTareas() {
		if (Tareas.find({'asignado.id': Meteor.userId(), abierto: true}).fetch().length > 0) {
			return true;
		} else {
			return false;
		}
	}
});

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
		Modal.show('usuarioForm');
	}
});

Template.botonNuevosContactos.events({
	'click .persona': function () {
		Modal.show('clienteNuevoModal');
	},
	'click .empresa': function () {
		Modal.show('empresaNuevoModal');
	},
	'click .caso': function () {
		Modal.show('casoNuevoModal');
	}
});

Template.clienteNuevoModal.onRendered(function () {
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
		debugger;
		let datos = {
			nombre: template.find('[name="nombre"]').value,
			apellido: template.find('[name="apellido"]').value || "",
			direccion: template.find('[name="direccion"]').value || "",
			telefono: template.find('[name="telefono"]').value || "",
			celular: template.find('[name="celular"]').value || "",
			email: template.find('[name="email"]').value || "",
			identificacion: template.find('[name="identificacion"]').value || "",
			provincia: template.find('[name="provincia"]').value || "",
			pais: template.find('[name="pais"]').value || "",
			bufeteId: Meteor.user().profile.bufeteId,
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
			facturacion:{
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

		if (datos.nombre !== "") {
			Meteor.call('crearCliente', datos, function (err, result) {

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
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
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
		return Asuntos.find({abierto:true},{limit:3})
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
		Modal.show('clienteNuevoModal');
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
 		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
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
	'click .por-fecha':() =>{

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
				closeOnConfirm: false
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
				// swal("Asunto cerrado", "El asunto ha sido archivado correctamente.", "success");
			});
	},
	'click .editar-asunto': () => {
		Modal.show('asuntoEditarModal');
	}
});

Template.detalleAsunto2.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('expediente', asuntoId);
   });
});

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
		return Tareas.find({ 'asunto.id': FlowRouter.getParam('asuntoId'), abierto: true }, {sort: {createdAt: -1}});
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
	},
	'click .comentar': function (event, template) {

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
	}
});

Template.tareasDetalle2.onCreated( function () {
	var self = this;

	self.autorun(function() {
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('misTareas');
    	//self.subscribe('expediente', asuntoId);
		let tareaId = FlowRouter.getParam('tareaId');
    	self.subscribe('comentarioDeTareas', tareaId, Meteor.user().profile.bufeteId);
   });
});

Template.tareasDetalle2.helpers({
	tareas() {
		return Tareas.find({ abierto: true }, {sort: {createdAt: -1}});
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
        		if (err) {
        			Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        			template.find('[name="crear-subtarea"]').value = "";
        		} else {
        			template.find('[name="crear-subtarea"]').value = "";
        			Bert.alert('Agregaste una sub tarea', 'success');
        		}
        	});
    	}
	}
});

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
                /*let data = {
                  nombre: datos.nombre,
                  asunto: {
                    nombre: doc.metadata.asunto.nombre,
                    id: doc.metadata.asunto.id
                  },
                  creador: {
                    nombre: Meteor.user().profile.nombre + ' ' + Meteor.user().profile.apellido,
                    id: Meteor.userId()
                  },
                  bufeteId: Meteor.user().profile.bufeteId

                }*/

                $('#doc-modal').modal('hide');
                Bert.alert('Subiste el archivo', 'success');

                /*Meteor.call('agregarDocNews', data, function (err) {
                  if (err) {
                    Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
                  } else {
                    template.find('[name="nombre"]').value = "";
                    template.find('[name="descripcion"]').value = "";
                    $('#doc-modal').modal('hide');
                    Bert.alert('Subiste el archivo', 'success');
                  }

                });*/

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
    	//self.subscribe('tarea', tareaId);
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
    	self.subscribe('docs', bufeteId);
   });
});

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
		return Documentos.find({}, {sort: {createdAt: -1}});
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


Template.detalleTareaAsunto.events({
	'click .comentar': (e, template) => {
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

	//var asuntoId = Session.get('asunto-id');
	let asuntoId = FlowRouter.getParam('asuntoId');

	self.autorun(function() {
		self.subscribe('expediente', asuntoId);
    	self.subscribe('conversacionesAsunto', asuntoId);
    	self.subscribe('comentariosDeConversacionesAsunto', asuntoId);
   });
});

Template.detalleConversacion2.helpers({
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
	}
});

Template.contactos2.onCreated(function () {
	var self = this;
	Session.set('nombre-contacto',"")

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('contactos', bufeteId);
   });
});

Template.contactos2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	clientes() {
		var regexNombre = new RegExp(".*"+Session.get('nombre-contacto')+".*","i");

		return Clientes.find({nombreCompleto:regexNombre, estatus: 'contacto'}, {sort: {createdAt: -1}});
	}
});

Template.contactos2.events({
	'keyup .buscador-contacto'(){
		Session.set('nombre-contacto',$(".buscador-contacto").val())
	}
})

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
				id: $( ".cliente" ).val()
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

		})

	}
})

Template.asuntoTareaModal.events({

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

	self.autorun(function () {
		let id = Meteor.user()._id;
		let bufeteId = Meteor.user().profile.bufeteId;

		self.subscribe('asuntosxequipo',id,bufeteId);
	})
})

Template.asuntoTareaModal.helpers({
	asuntos(){
		return Asuntos.find({abierto:true});
	}
})

Template.asuntoTareaModal.onRendered(function () {

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
		let tareaId = this._id,
				asunto = {
					id: template.find("[name='asunto-tarea']").value,
					nombre: $(template.find('[name="asunto-tarea"]')).find(":selected").html()
			};

		Meteor.call('actualizarAsuntoTarea',tareaId,asunto,function (err) {
				if(err) return Bert.alert('Hubo un error al momento de crear, intentelo de nuevo','danger')
				Bert.alert('Se asigno correctamente el asunto a la tarea','success');
				Modal.hide('asuntoTareaModal')
		})
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
    	self.subscribe('comentariosDeConversacionesNota', _id);
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
	},
	comentarios() {
		return ComentariosNotas.find({notaId: Template.parentData(0)._id});
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

    	self.subscribe('casos2', bufeteId);


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
	}
});


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
	},
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
	}
});


Template.asuntoNuevoModal.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
		self.subscribe('clientes', bufeteId);
   });
});

Template.asuntoNuevoModal.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.asuntoNuevoModal.helpers({
	mienbros: () => {
		return Meteor.users.find();
	},
	clientes: () => {
		return Clientes.find();
	}
});

Template.asuntoNuevoModal.events({
	'click .agregar-cliente': function (event,template) {
		Modal.show('clienteNuevoModal');
	},
	'click .agregar-asunto': function (event, template) {
			event.preventDefault();

			let asunto = {}
			debugger;
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


			if (asunto.caratula !== "") {

				Meteor.call('crearAsunto', asunto, function (err, result) {
					if (err) {
						Bert.alert('Hubo un error, vuelva a intentarlo', 'warning');
						template.find( '[name="caratula"]' ).value = "";
						template.find( '[name="carpeta"]' ).value = "";
						template.find( '[name="juzgado"]' ).value = "";
						template.find( '[name="observaciones"]' ).value = "";
						template.find( '[name="fecha"]' ).value = "";
					} else {
						template.find( '[name="caratula"]' ).value = "";
						template.find( '[name="carpeta"]' ).value = "";
						template.find( '[name="juzgado"]' ).value = "";
						template.find( '[name="observaciones"]' ).value = "";
						template.find( '[name="fecha"]' ).value = "";
						Bert.alert('Creaste un asunto', 'success');
						FlowRouter.go('/asuntos2/d/' + result.asuntoId);
					}


				});

				//console.log(asunto);



			} else {
				Bert.alert( 'Ingrese los datos correctamente', 'warning' );

				template.find( '[name="caratula"]' ).value = "";
				template.find( '[name="carpeta"]' ).value = "";
				template.find( '[name="juzgado"]' ).value = "";
				template.find( '[name="observaciones"]' ).value = "";
				template.find( '[name="fecha"]' ).value = "";
			}
		}

});

// Mi Ccalendario Personal

let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};

Template.miCalendario.onRendered( () => {
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
        		event.editable = true //!isPast( event.start );
        		return event;
      		});

    		if ( data ) {
        		callback( data );
      		}
    	},
    	eventRender( event, element ) {
      		element.find( '.fc-content' ).html(
        		`<h4>${ event.title }</h4>
         		<p class="type-${ event.type }">#${ event.type }</p>
        		`
      		);
    	},
    	eventDrop( event, delta, revert ) {

      			let date = event.start.format();

      			console.log(delta);


        		let update = {
          			_id: event._id,
          			start: date,
          			end: date,
          			bufeteId: Meteor.user().profile.bufeteId
        		};

        		Meteor.call( 'editEvent', update, ( error ) => {
          			if ( error ) {
            		Bert.alert( error.reason, 'danger' );
          			}
        		});


    	},
    	dayClick( date ) {
      		Session.set( 'eventModal', { type: 'add', date: date.format() } );
      		$( '#add-edit-event-modal' ).modal( 'show' );
    	},
    	eventClick( event ) {
      		Session.set( 'eventModal', { type: 'edit', event: event._id } );
      		$( '#add-edit-event-modal' ).modal( 'show' );
    	},
    	editable: true
	 });

	 Tracker.autorun( () => {
    	MiCalendario.find().fetch();
    	$( '#calendario' ).fullCalendar( 'refetchEvents' );
  	});
});

Template.miCalendario.onCreated( () => {
	let template = Template.instance();
  	template.subscribe('miCalendario');
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



// Logica del Gantt

Template.Gantt.onCreated(function () {
	var self = this;

	self.autorun(function() {
    	self.subscribe('TareasGantt');
    	self.subscribe('LinksGantt');
   });
});


Template.Gantt.onRendered(() => {

	// Cambiamos a español
	gantt.locale = {
    date: {
        month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
        month_short: ["Ene", "Feb", "Mar", "Abr", "Mayo", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
        day_full: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        day_short: ["Dom", "Lun", "Mar", "Mierc", "Jue", "Vier", "Sab"]
    },
    labels:{
        new_task:"Tarea nueva",
        icon_save:"agregar",
        icon_cancel:"cancelar",
        icon_details:"detalles",
        icon_edit:"Modificar",
        icon_delete:"Eliminar",
        confirm_closing:"",//Vos modifications seront perdus, êtes-vous sûr ?
        confirm_deleting:"¿Seguro que deseas eliminar la tarea?",

        section_description:"Descripción",
        section_time:"Periodo",
        section_type:"Tipo",

        /* grid columns */

        column_text :  "Asuntos",
        column_start_date : "Inició",
        column_duration : "Duración",
        column_add : "",


        /* link confirmation */

        type_task: "Tarea",
        type_project: "Projecto",
        type_milestone: "Hito",


        minutes: "Minutos",
        hours: "Horas",
        days: "Dias",
        weeks: "Semanas",
        months: "Meses",
        years: "Años"
    	}
	};

	gantt.attachEvent("onAfterTaskAdd", function(id,item){

	});


	gantt.config.start_date = new Date(new Date().getFullYear(),0,1);

	gantt.config.end_date = new Date(new Date().getFullYear(), 11, 31)


	// Inicializamos el Gantt
	gantt.init("diagrama");

	// Conectamos la base de datos
	gantt.meteor({tasks: TasksCollection.find(), links: LinksCollection.find()},
				{tasks: TasksCollection, links: LinksCollection}
		);
	gantt.showDate(new Date())

});

//usage

Template.Gantt.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

// logica de cliente para hacer el chart tipo pie

Template.pieChart.onCreated(function () {

	var self = this;

	self.autorun(function() {
    	self.subscribe('slices');

   });

	Session.setDefault('pieChartSort','none');
	Session.setDefault('pieChartSortModifier',undefined);
});

Template.pieChart.events({
	'click #add':function(){
		Meteor.call('add-slice', function (error, result) {

		});
	},
	'click #remove':function(){
		Meteor.call('remove-slice', function (error, result) {

		});
	},
	'click #randomize':function(){
		Meteor.call('random-slice', function (error, result) {

		});
	},
	'click #toggleSort':function(){
		if(Session.equals('pieChartSort', 'none')){
			Session.set('pieChartSort','asc');
			Session.set('pieChartSortModifier',{sort:{value:1}});
		}else if(Session.equals('pieChartSort', 'asc')){
			Session.set('pieChartSort','desc');
			Session.set('pieChartSortModifier',{sort:{value:-1}});
		}else{
			Session.set('pieChartSort','none');
			Session.set('pieChartSortModifier',{});
		}
	}
});

Template.pieChart.onRendered(function(){
	//Width and height
	/*var w = 200;
	var h = 200;

	var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();

	//Create SVG element
	var svg = d3.select("#pieChart")
				.attr("width", w)
				.attr("height", h);

	var key = function(d){
		return d.data._id;
	};

	Deps.autorun(function(){
		var modifier = {fields:{value:1}};
		var sortModifier = Session.get('pieChartSortModifier');
		if(sortModifier && sortModifier.sort)
			modifier.sort = sortModifier.sort;

		var dataset = Slices.find({},modifier).fetch();

		var arcs = svg.selectAll("g.arc")
					  .data(pie(dataset), key);

		var newGroups =
			arcs
				.enter()
				.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

		//Draw arc paths
		newGroups
			.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);

		//Labels
		newGroups
			.append("text")
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.value;
			});

		arcs
			.transition()
			.select('path')
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});

		arcs
			.transition()
			.select('text')
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.text(function(d) {
				return d.value;
			});

		arcs
			.exit()
	 		.remove();
	});*/

		function chartLine(){

			var ctx4 = document.getElementById("myChart4").getContext("2d");

			var data4 = [
				{
						value: Clientes.find({estatus:"contacto"}).count(),
						color:"#2ecc71",
						highlight: "#e74c3c",
						label: "Contactos"
				},
				{
						value: Clientes.find({estatus:'prospecto'}).count(),
						color: "#9b59b6",
						highlight: "#2ecc71",
						label: "Prospectos"
				},
				{
						value: Clientes.find({estatus:'cliente'}).count(),
						color: "#e74c3c",
						highlight: "#9b59b6",
						label: "Clientes"
				}]

				let myPieChart = new Chart(ctx4).Pie(data4,{
						animateScale: true
				});

		}

		Tracker.autorun(chartLine);
});

function random() {
    return Math.floor((Math.random() * 100) + 1);
}

// Logica de cliente para hacer un chart de tipo line chart

Template.charts.onRendered(function() {
    // Get the context of the canvas element we want to select

    /*var ctx2 = document.getElementById("myChart2").getContext("2d");
    var ctx3 = document.getElementById("myChart3").getContext("2d");
    var ctx4 = document.getElementById("myChart4").getContext("2d");
    var ctx5 = document.getElementById("myChart5").getContext("2d");*/

    // Set the options
    function chartLine () {
    	var ctx  = document.getElementById("myChart").getContext("2d");
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

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    var options2 = {
        //Boolean - Whether to show lines for each scale point
        scaleShowLine: true,

        //Boolean - Whether we show the angle lines out of the radar
        angleShowLineOut: true,

        //Boolean - Whether to show labels on the scale
        scaleShowLabels: false,

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,

        //String - Colour of the angle line
        angleLineColor: "rgba(0,0,0,.1)",

        //Number - Pixel width of the angle line
        angleLineWidth: 1,

        //String - Point label font declaration
        pointLabelFontFamily: "'Arial'",

        //String - Point label font weight
        pointLabelFontStyle: "normal",

        //Number - Point label font size in pixels
        pointLabelFontSize: 10,

        //String - Point label font colour
        pointLabelFontColor: "#666",

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 3,

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

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    }

    // Set the data
    var data = {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [random(), random(), random(), random(), random(), random(), random()]
        }, {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [random(), random(), random(), random(), random(), random(), random()]
        }]
    };
    var data2 = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [random(), random(), random(), random(), random(), random(), random()]
        }, {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [random(), random(), random(), random(), random(), random(), random()]
        }]
    };

    var data3 = [{
            value: random(),
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        }, {
            value: random(),
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        }, {
            value: random(),
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        }, {
            value: random(),
            color: "#949FB1",
            highlight: "#A8B3C5",
            label: "Grey"
        }, {
            value: random(),
            color: "#4D5360",
            highlight: "#616774",
            label: "Dark Grey"
        }

    ];
    var data4 = [
    {
        value: random(),
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: random(),
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: random(),
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
    ]

    // draw the charts
    var myLineChart = new Chart(ctx).Line(data, options);
     /*var myRadarChart = new Chart(ctx2).Radar(data2, options2);
    var myPolarArea = new Chart(ctx3).PolarArea(data3, {
        segmentStrokeColor: "#000000"
    });
    // For a pie chart
    var myPieChart = new Chart(ctx4).Pie(data4,{
        animateScale: true
    });

    // And for a doughnut chart
    var myDoughnutChart = new Chart(ctx5).Doughnut(data4,{
        animateScale: true
    });*/
    }

    Tracker.autorun(chartLine);


});

Template.charts.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

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
	        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Noviembre","Diciembre"],
	        datasets: [{
	            label: "Abiertos",
	            fillColor: "rgba(151,187,205,0.2)",
	            pointHighlightStroke: "rgba(151,187,195,1)",
	            data: data_abierto
	        },{
	            label: "Cerrados",
	            fillColor: "rgba(151,111,205,0.2)",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: data_cerrado
	        },{
	            label: "No resueltos",
	            fillColor: "rgba(151,177,205,0.2)",
	            pointHighlightStroke: "rgba(151,127,205,1)",
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
	}
});

Template.formularioParaCrearTarifa.onRendered(function () {

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

		Meteor.call('registrarTarifa',tarifa,function (err) {
			if(err) return Bert.alert('No se pudo registrar la tarifa, intentelo nuevamente','danger');
			Bert.alert('Se registro correctamente la tarifa','success');
			$("input[type='number']").val("");
			$("input[type='text']").val("");
		})

	}
});

Template.cobros.onRendered(function () {

});

Template.cobros.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.cobros.events({
	'click .generar-cobros': function () {
		Modal.show('generarCobroModal');
	}
});
