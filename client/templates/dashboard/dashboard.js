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
})

Template.tareas2.helpers({
	tareas(){
		return Tareas.find({"$and":[
			{'asignado.id':Meteor.userId()},
			{abierto:Session.get('tipo-tarea')}
		]})
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
	}
})

Template.nuevaTareaModal.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

		self.subscribe('asuntos', bufeteId);
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
});

Template.nuevaTareaModal.helpers({
	asuntos: function () {

		return Asuntos.find();
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
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}
		}

		if (datos.asunto.nombre === "Elige un asunto") {
			datos.asunto.nombre = "Sin asunto";
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
	}
});

/*
Template.tareas.onCreated(function () {
	var self = this;

	self.autorun(function() {
		self.subscribe('tareas');
	});
});
*/

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
	'click .listo': function () {
		console.log('listo!');

		Meteor.call('cerrarTarea', this._id, function (err, result) {
			if (err) {
				Bert.alert('Algo salio mal', 'warning');
			} else {
				Bert.alert('Cerraste una tarea', 'success');
			}
		});
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
		return Tareas.find({'asignado.id': Meteor.userId()});
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
	}
});

Template.clienteNuevoModal.events({
	'click .guardar-contacto': function (event, template) {
		event.preventDefault();

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
			autor: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
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

		return Asuntos.find({})
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
	asuntos() {
		return Asuntos.find({abierto:Session.get('estado-asunto')}, {sort: {createdAt: -1}});
	},
	cantidad() {
		return Asuntos.find({abierto:Session.get('estado-asunto')}).fetch().length;
	},
	tipo(){

		let estado = Session.get('estado-asunto')? 'abiertos' : 'archivados';
		return estado;
 	}
});

Template.asuntos2.onCreated( function () {
	
	var self = this;

	Session.set('estado-asunto',true);

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('asuntos', bufeteId);
   });	

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

	}

});

Template.cuadroAsuntoNuevo.events({
	'click .nuevo': () => {
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
		return Tareas.find({ 'asunto.id': FlowRouter.getParam('asuntoId') }, {sort: {createdAt: -1}});
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
    	//self.subscribe('tarea', tareaId);
    	self.subscribe('comentarioDeTareas', tareaId, Meteor.user().profile.bufeteId);
   });
});

Template.detalleTareaAsunto.helpers({
	tareas() {
		return Tareas.find({ 'asunto.id': FlowRouter.getParam('asuntoId') }, {sort: {createdAt: -1}});
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

Template.adjuntarArchivoTarea.events( {
	'submit form': function (e, t) {
		e.preventDefault();
		subirArchivoTarea(e, t);
	}
});

Template.menuTareas2.helpers({
	asuntoId() {
		return FlowRouter.getParam('asuntoId');
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
		return Meteor.user().emails[0].address
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
	},
	comentarios() {
		return ComentariosConversaciones.find({conversacionId: Template.parentData(0)._id});
	}
});

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
	},
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

	var asuntoId = Session.get('asunto-id');

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
		return ConversacionesAsunto.find({asuntoId:Session.get('asunto-id')}, {sort: {createdAt: -1}});
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

Template.clientes2.helpers({
	email() {
		return Meteor.user().emails[0].address
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
	}
});

Template.contactos2.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let bufeteId = Meteor.user().profile.bufeteId;
    	self.subscribe('clientes', bufeteId);
   });
});

Template.contactos2.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	clientes() {
		return Clientes.find({}, {sort: {createdAt: -1}});
	}
});

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

Template.casos.helpers({
	email() {
		return Meteor.user().emails[0].address
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