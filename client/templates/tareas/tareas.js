Template.nuevaTarea.onCreated(function () {
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

	gantt.config.start_date = new Date();

	gantt.init("gantt_here");

	gantt.meteor({tasks: TasksCollection, links: LinksCollection});
});



Template.nuevaTarea.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.nuevaTarea.helpers({
	asuntos: function () {
		return Asuntos.find();
	}
});

Template.nuevaTarea.events({
	'submit form': function (events, template) {
		events.preventDefault();

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
					console.log('algo salio mail :c');
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

Template.tareas.onCreated(function () {
	var self = this;

	self.autorun(function() {
    	self.subscribe('tareas');
   });
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

Template.tareas.helpers({
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

Template.tareas.events({
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
