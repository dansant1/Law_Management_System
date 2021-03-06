Template.nuevaTareaModal.helpers({
	asuntos: function () {
		return Asuntos.find({abierto:true,abogados:{$elemMatch:{id:Meteor.userId()}}});
	},
	miembros: function () {
		debugger;

		if(Session.get("asunto-id")===""||Session.get("asunto-id")===undefined) return Meteor.users.find();

		var n = Asuntos.find({_id:Session.get("asunto-id")}).fetch()[0].abogados.length
		if(n==0) return Meteor.users.find();

		return Asuntos.find({_id:Session.get("asunto-id")}).fetch()[0].abogados;
	},
	etapas:function () {
		return Etapas.find({'asunto.id':Session.get('asunto-id')});
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

Template.nuevaTareaModal.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let id = Meteor.user()._id;

		let bufeteId = Meteor.user().profile.bufeteId;

		self.subscribe('asuntosxequipo',id, bufeteId);
		self.subscribe('etapas',bufeteId)
	});
});


Template.nuevaTareaModal.events({
	'click .agregar-tareas': function (events, template) {
		events.preventDefault();
		events.stopPropagation();
		debugger;
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			asunto: {
				nombre: $(template.find( ".asunto option:selected" )).text(),
				id: $(template.find( ".asunto" )).val()
			},
			tipo: $(template.find(".tipo")).val(),
			bufeteId: Meteor.user().profile.bufeteId,
			asignado:{
				id: Meteor.userId(),
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
			},
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			etapa:{
				id: template.find("[name='etapa']").value,
				nombre: Etapas.findOne({_id:template.find("[name='etapa']").value}).nombre
			}
		}


		if (datos.asunto.nombre === "Elige un asunto" && datos.asunto.id === "") {
			datos.asunto.nombre = undefined;
			datos.asunto.id = undefined;
		}

		if (datos.descripcion !== "" && datos.fecha !== "") {
			Meteor.call('crearTarea', datos, function (err, result) {
				if (err) return	Bert.alert('Error al tratar de registrar, intentelo de nuevo', 'danger');

				template.find('[name="descripcion"]').value = "";
				template.find('[name="fecha"]').value = "";
				Bert.alert('Agregaste una tarea', 'success');
				Modal.hide('nuevaTareaModal');
			});

		} else {
			Bert.alert('Ingresa los datos', 'warning');
		}
	},
	'change .asunto'(event,template){
		Session.set("asunto-id",$(event.target).val())
	}

});


Template.nuevaTareaModal.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });

	Session.set("asunto-id","")

});


Template.nuevaTareaModal2.helpers({
	asuntos: function () {
		return Asuntos.find({abierto:true,abogados:{$elemMatch:{id:Meteor.userId()}}});
	},
	miembros: function () {
		debugger;

		if(Session.get("asunto-id")===""||Session.get("asunto-id")===undefined) return Meteor.users.find();

		var n = Asuntos.find({_id:Session.get("asunto-id")}).fetch()[0].abogados.length
		if(n==0) return Meteor.users.find();

		return Asuntos.find({_id:Session.get("asunto-id")}).fetch()[0].abogados;
	},
	etapas:function () {
		return Etapas.find({'asunto.id':Session.get('asunto-id')});
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

Template.nuevaTareaModal2.onCreated(function () {
	var self = this;

	self.autorun(function() {
		let id = Meteor.user()._id;

		let bufeteId = Meteor.user().profile.bufeteId;

		self.subscribe('asuntosxequipo',id, bufeteId);
		self.subscribe('etapas',bufeteId)
	});
});


Template.nuevaTareaModal2.events({
	'click .agregar-tareas': function (events, template) {
		events.preventDefault();
		events.stopPropagation();
		//debugger;
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			asunto: {
				nombre: $(template.find( ".asunto option:selected" )).text(),
				id: $(template.find( ".asunto" )).val()
			},
			tipo: $(template.find(".tipo")).val(),
			bufeteId: Meteor.user().profile.bufeteId,
			asignado:{
				id: Meteor.userId(),
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
			},
			creador: {
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
				id: Meteor.userId()
			},
			etapa:{
				id: template.find("[name='etapa']").value,
				nombre: Etapas.findOne({_id:template.find("[name='etapa']").value}).nombre
			}
		}


		if (datos.asunto.nombre === "Elige un asunto" && datos.asunto.id === "") {
			datos.asunto.nombre = undefined;
			datos.asunto.id = undefined;
		}

		if (datos.descripcion !== "" && datos.fecha !== "") {
			Meteor.call('crearTarea', datos, function (err, result) {
				if (err) return	Bert.alert('Error al tratar de registrar, intentelo de nuevo', 'danger');

				template.find('[name="descripcion"]').value = "";
				template.find('[name="fecha"]').value = "";
				Bert.alert('Agregaste una tarea', 'success');
				Modal.hide('nuevaTareaModal2');
			});

		} else {
			Bert.alert('Ingresa los datos', 'warning');
		}
	},
	'change .asunto'(event,template){
		Session.set("asunto-id",$(event.target).val())
	}

});


Template.nuevaTareaModal2.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });

	Session.set("asunto-id","")

});
