Template.workflowsDeTareas.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.tareasGantt.onCreated(function () {
	var self = this;

	self.autorun(function() {
    	self.subscribe('TareasGantt');
    	self.subscribe('LinksGantt');
   });
});

Template.tareas2.onCreated(function () {
		var self = this;

		Session.set('tipo-tarea',true);
		Session.set('filtro-tarea',{})
		self.autorun(function () {
			self.subscribe('misTareas')
		})
});

Template.tareas2.helpers({

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

	estaAbierto() {
		if (this.abierto === true) {
			return true;
		} else {
			return false;
		}
	}
})

Template.tablat.onCreated(function () {
	var self = this;

		//Session.set('tipo-tarea',true);
		Session.set('query',"")
		self.autorun(function () {
			self.subscribe('misTareas');
			self.subscribe('MisSubtareas', Meteor.user().profile.bufeteId)
			self.subscribe('MisComentariosDeTareas', Meteor.user().profile.bufeteId)
			self.subscribe('MisDocumentosDeTareas', Meteor.user().profile.bufeteId)
		})
});

Template.tablat.helpers({
	tareas(){
		debugger;
		var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/

		var buscador = new RegExp(".*"+Session.get('query')+".*","i");
		let $and = [
			{'asignado.id':Meteor.userId()},
			{abierto:Session.get('tipo-tarea')},
			Session.get('filtro-tarea'),
			{$or:[
				{descripcion:buscador},
				{'asunto.nombre':buscador},
				{'etapa.nombre':buscador}
			]}
		]


		function clone(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    var copy = obj.constructor();
		    for (var attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		}


		if(Session.get('query').match(dateReg)!=null){
			let fecha = Session.get('query');
			let mañana;

			datosFecha = fecha.split("-");
			fecha = datosFecha[2]+"-"+datosFecha[1]+"-"+datosFecha[0];

			fecha = new Date(fecha + " GMT-0500");
			fecha.setHours(0,0,0,0);

			mañana = new Date(fecha + " GMT-0500" );
			mañana.setDate(mañana.getDate()+1);
			mañana.setHours(0,0,0,0);

			$and.push({vence:{$gte:fecha,$lt:mañana}});
		}

		return Tareas.find({$and:$and}, {sort: {createdAt: -1}})
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
	documentos(){
		return DocumentosTareas.find({'metadata.tareaId':this._id}).fetch().length;
	},
	subtareas(){
		return Subtareas.find({tareaId:this._id}).fetch().length;
	},
	comentarios(){
		return ComentariosDeTareas.find({tareaId:this._id}).fetch().length;
	},
	esMiTarea() {
		debugger;
		if (this.asignado.id === Meteor.userId()) {
			return true;
		} else {
			false;
		}
	},
	checked: function () {
		var hecho = this.abierto;

		if (hecho) {
			return "";
		} else {
			return "checked";
		}
	}
});

Template.tablat.events({
	'click .agregar-fecha-tarea'(){
		Modal.show('fechaTareaModal',this)
	},
	'click .agregar-asunto-tarea'(){
		Modal.show('asuntoTareaModal',this);
	},
	'click .agregar-miembro-tarea'(){
		Modal.show('miembroTareaModal',this);
	},
	'click .agregar-horas'(){
		Modal.show('horaTareaModal',this)
	},
	'click [name="mycheckbox"]'(){
		Meteor.call('cerrarTarea',this._id,function (err) {
			if(err) return Bert.alert('No se pudo cerrar la tarea','danger');
			Bert.alert('Se cerro la tarea correctamente','success')
		})
	},
	'click .editar-tarea'(event,template){
		Session.set('tarea-id',$(event.target).data('id'))
		Modal.show('editarTareaModal')
	},
	'click .eliminar-tarea'(event,template){
		Session.set('tarea-id',$(event.target).data('id'));
	},
	'keyup [name="crear-tarea-simple"]': function (event, template) {

		let datos = {
			descripcion: template.find('[name="crear-tarea-simple"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			}
		}

		if(event.which == 13){
        	//$(event.target).blur();
        	template.find('[name="crear-tarea-simple"]').value = "";
        	Meteor.call('agregarTarea', datos, function (err, result) {
        		if (err) {
        			Bert.alert('Hubo un error, vuelve a intentarlo', 'warning');
        			template.find('[name="crear-tarea-simple"]').value = "";
        		} else {
        			template.find('[name="crear-tarea-simple"]').value = "";
        			Bert.alert('Agregaste una tarea', 'success');
        		}
        	});
    	}
	}
});

Template.tareas2.events({
	'click .agregar-etapa'(){
		Modal.show('agregarEtapaModal')
	},
	'click .agregar-equipo'(){
		Modal.show('crearEquipoModal')
	},
	'click .abiertos'(){
		Session.set('tipo-tarea',true)
	},
	'click .cerrados'(){
		Session.set('tipo-tarea',false)
	},
	'click .nuevas-tareas'(){
		Modal.show('nuevaTareaModal2')
	},
	'keyup .buscador-tareas'(event){
		Session.set('query',event.target.value);
	},
	'click .hoy'(){
		debugger;
		let hoy = new Date()
	    hoy.setHours(0,0,0,0);

	    let mañana = new Date();
	    mañana.setDate(mañana.getDate()+1)
	    mañana.setHours(0,0,0,0)

		let filtro = {
			vence:{
				$gte:hoy,
				$lt:mañana
			}
		}
		Session.set('tipo-tarea',true)
		Session.set('filtro-tarea',filtro)
	},
	'click .todos'(){
		Session.set('tipo-tarea',true)
		Session.set('filtro-tarea',{})
	},
	'click .mañana'(){

	    let mañana = new Date();
	    mañana.setDate(mañana.getDate()+1)
	    mañana.setHours(0,0,0,0)

		let pasadomañana = new Date();
		pasadomañana.setDate(pasadomañana.getDate()+2)
		pasadomañana.setHours(0,0,0,0)

		let filtro = {
			vence:{
				$gte:mañana,
				$lt:pasadomañana
			}
		}
		Session.set('tipo-tarea',true)
		Session.set('filtro-tarea',filtro)

	},
	'click .semana'(){
		function getMonday(d) {
		  d = new Date(d);
		  var day = d.getDay(),
		      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
		  return new Date(d.setDate(diff));
		}

		var monday = getMonday(new Date())
		monday.setHours(0,0,0,0)
		var sunday = getMonday(new Date())
		sunday.setDate(sunday.getDate()+6)
		sunday.setHours(0,0,0,0)

		let filtro = {
			vence:{
				$gte:monday,
				$lt:sunday
			}
		}
		Session.set('tipo-tarea',true)
		Session.set('filtro-tarea',filtro)
	},
	'click .vencidas'(){
		let hoy = new Date()
		hoy.setHours(0,0,0,0)
		let filtro = {
			vence:{
				$lt: hoy
			}
		}
		Session.set('tipo-tarea',true)
		Session.set('filtro-tarea',filtro)
	},
	'click .eliminar-tarea'(event,template){
		debugger;
		swal({  title: "¿Seguro que quieres eliminar esta tarea?",
				text: "Esta tarea ya no estara disponible para el resto de tu equipo",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, eliminar hora",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: false
			},
			function() {
				let tareaId = $(event.target).data('id');
				Meteor.call('eliminarTarea',tareaId,function (err) {
					if(err) return Bert.alert('Hubo un error al momento de eliminar','danger');
					swal('Tarea eliminada','La tarea se elimino correctamente','success')
				});
			});
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

Template.documentosDeTareas.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.listaDeArchivosDeTareas.onCreated(function () {
		var self = this;
		self.autorun(function () {
			let bufeteId = Meteor.user().profile.bufeteId;
			self.subscribe('documentosTareas', bufeteId)
		})
});

Template.listaDeArchivosDeTareas.helpers({
	documentos() {
		return DocumentosTareas.find({});
	},
	dia() {
		var d = this.uploadedAt,
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
	}
});
