Template.facturacion.onRendered(function(){
	var self = this;
	var bufeteId = Meteor.user().profile.bufeteId
	Session.set('filtro-hora',{})

	self.autorun(function(){
		debugger;
		if(Meteor.user().roles.bufete[0]=="administrador") return self.subscribe('horas',bufeteId)
		return self.subscribe('horasxmiembro',bufeteId,Meteor.userId())
	})
})

Template.facturacion.onCreated(function () {
	Session.set('buscador-valor',"");
})

Template.facturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	},

	moneda(){
		debugger;
		let asunto = Asuntos.find({_id:this.asunto.id}).fetch[0];
		return (asunto.facturacion.tipo_moneda == "soles")? "S/." : "$";
	},
	horas(){
		debugger;
		var buscador = new RegExp(".*"+Session.get('buscador-valor')+".*","i");

		let _asuntos = Asuntos.find({'cliente.nombre':buscador}).fetch();

		let _asuntosId = _(_asuntos).map(function (_asunto) {
			return _asunto._id;
		})

		let query = {}
		let $or;
		
		if(Session.get('buscador-valor')!=""){

			$or = [
			// {bufeteId:Meteor.user().profile.bufeteId},
				{'descripcion':buscador},
				{'asunto.nombre':buscador},
				{'asunto.id':{
					$in:_asuntosId
				}}
			]
		}
		else {
			$or = [
				{bufeteId:Meteor.user().profile.bufeteId},
				{'descripcion':buscador},
				{'asunto.nombre':buscador},
				{'asunto.id':{
					$in:_asuntosId
				}}
			]

		}

		query.$or = $or;

		if(!$.isEmptyObject(Session.get('filtro-hora'))){

			delete query.$or;
			query.$and = []
			query.$and.push(Session.get('filtro-hora'));
			query.$and.push({$or:$or})

		}

		if(!$.isEmptyObject(Session.get('cliente-hora'))){

			let asuntos = Asuntos.find({'cliente.id':Session.get('cliente-hora')}).fetch();

		 	let asuntosId = _(asuntos).map(function (asunto) {
				return asunto._id;
			})

			if(query.$or) delete query.$or;
			if(query.$and instanceof Array)
			{
				query.$and.push({
					'asunto.id':{
						$in:asuntosId
					}
				})
				// query.$and.push({'asunto.id':Session.get('asunto-hora')})
			}
			else {
				query.$and = []
				query.$and.push({
					'asunto.id':{
						$in:asuntosId
					}
				})
				// query.$and.push({'asunto.id': Session.get('asunto-hora')});
				query.$and.push({$or:$or})
			}

		}

		if(!$.isEmptyObject(Session.get('asunto-hora'))) {
			if(query.$or) delete query.$or;
			if(query.$and instanceof Array) query.$and.push({'asunto.id':Session.get('asunto-hora')})
			else {
				query.$and = []
				query.$and.push({'asunto.id': Session.get('asunto-hora')});
				query.$and.push({$or:$or})
			}
		}

		if(!$.isEmptyObject(Session.get('miembro-equipo'))){
			let _asuntos = Asuntos.find({'abogados':{ $elemMatch:{ id: Session.get('miembro-equipo')}}}).fetch();
			debugger;
			let ids = _(_asuntos).map(function (_asunto) {
				return _asunto._id;
			})

			if(query.$or) delete query.$or;
			if(query.$and instanceof Array) query.$and.push({'asunto.id':{$in:ids}});
			else {
				query.$and = []
				query.$and.push({'asunto.id':{$in:ids}})
				query.$and.push({$or:$or})
			}
		}

		return Horas.find(query);
		// debugger;
		// var filtro = {}
		//
		// filtro['asunto.id'] = Session.get('asunto-hora')
		// filtro.fecha = $.isEmptyObject(Session.get('filtro-hora'))? {}: Session.get('filtro-hora').fecha
		//
		// return Horas.find(filtro);

	},
	cliente(){
		return Asuntos.find({_id:this.asunto.id}).fetch()[0].cliente.nombre;
	},
	esAdministradoroEncargado(){
		return Meteor.user().roles.bufete.indexOf("administrador")>=0||Meteor.user().roles.bufete.indexOf("encargado comercial")>=0;
	},
	tipo_cambio(){
		debugger;
		if(Asuntos.find({_id:this.asunto.id}).fetch()[0].facturacion.tipo_moneda == "soles") return "S/. "
		return "$ "
	}
});

Template.facturacion.events({
	'click .agregar-hora'(){
		Modal.show('agregarHoras')
	},
	'click .agregar-gasto'(){
		Modal.show('agregarGasto')
	},
	'click .agregar-descripcion'(){
		Modal.show('agregarDescripcionHorasModal',this);
	},
	'click .agregar-asunto'(){
		Modal.show('agregarAsuntoHorasModal',this)
	},
	'click .todos'(){
		Session.set('asunto-hora',undefined);
		Session.set('filtro-hora',{})
		Session.set('cliente-hora',"")
	},
	'click .asuntos'(){
		Modal.show('filtroAsuntoHoraModal',this);
	},
	'click .cliente'(){
		Modal.show('filtroClienteHoraModal');
	},
	'click .miembros'(){
		Modal.show('filtroMiembroHoraModal');
	},
	'keyup .buscador-horas'(event,template){
		Session.set('buscador-valor',event.target.value);
	},
	'click .hoy'(){
		var mañana = new Date()
		mañana.setDate(mañana.getDate()+1);
		mañana.setHours(0,0,0,0)

		var hoy = new Date()
		hoy.setHours(0,0,0,0)

		return Session.set('filtro-hora',{fecha:{$lt:mañana,$gte:hoy}})
	},
	'click .ayer'(){
		var ayer = new Date()
		ayer.setDate(ayer.getDate()-1);
		ayer.setHours(0,0,0,0)

		var hoy = new Date();
		hoy.setHours(0,0,0,0)

		return Session.set('filtro-hora',{fecha:{$lt:ayer,$gte:hoy}});

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
			fecha:{
				$gte:monday,
				$lt:sunday
			}
		}
		// Session.set('tipo-tarea',true)
		return Session.set('filtro-hora',filtro)
	},
	'click .mes'(){
		var date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		let filtro = {
			fecha:{
				$gte:firstDay,
				$lt:lastDay
			}
		}

		return Session.set('filtro-hora',filtro)
	}
});

Template.reportesFacturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	}
});

Template.reportesFacturacion.events({
	'click .reporte-asunto': () => {
		Modal.show('reporteAsuntoModal');
	},
	'click .reporte-cliente': () => {
		Modal.show('reporteClienteModal');
	},
	'click .reporte-usuario': () => {
		Modal.show('reporteUsuarioModal');
	},
	'click .reporte-actividad': () => {
		Modal.show('reporteActividadModal');
	},
	'click .reporte-esfuerzo': () => {
		Modal.show('reporteEsfuerzoModal');
	}
});
