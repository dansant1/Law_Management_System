Template.gastos.helpers({
    
    email() {
      return Meteor.user().emails[0].address
    },
    costo(){
        if(Session.get('tipo-cambio')!="dolares") return "S/ "+ this.monto;
        return "$ " + (this.monto/Cambio.find().fetch()[0].cambio).toFixed(2);
    },

    gastos_normal(){
        return !Session.get('gastos-admin');
    },

	gastos(){
		debugger;
		var buscador = new RegExp(".*"+Session.get('query')+".*","i");

		let _asuntos = Asuntos.find({'cliente.nombre':buscador}).fetch();

		let _asuntosId = _(_asuntos).map(function (_asunto) {
			return _asunto._id;
		})

		let query = {}
        let $and = [{
            administrativo: Session.get('gastos-admin')
        }]
		let $or;

		if(Session.get('query')!=""){

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
        query.$and = $and;
        query.$and.push({$or:$or})

		if(!$.isEmptyObject(Session.get('filtro-hora'))){

			// delete query.$or;
			// query.$and = []
			query.$and.push(Session.get('filtro-hora'));
			// query.$and.push({$or:$or})

		}

		if(!$.isEmptyObject(Session.get('cliente-hora'))){

			let asuntos = Asuntos.find({'cliente.id':Session.get('cliente-hora')}).fetch();

		 	let asuntosId = _(asuntos).map(function (asunto) {
				return asunto._id;
			})

			// if(query.$or) delete query.$or;
			query.$and.push({
				'asunto.id':{
					$in:asuntosId
				}
			})
				// query.$and.push({'asunto.id':Session.get('asunto-hora')})
		}

        if(!Session.get('gastos-admin')){

    		if(!$.isEmptyObject(Session.get('asunto-hora'))) {
    			query.$and.push({'asunto.id':Session.get('asunto-hora')})
    		}

    		if(!$.isEmptyObject(Session.get('miembro-equipo'))){
    			let _asuntos = Asuntos.find({'abogados':{ $elemMatch:{ id: Session.get('miembro-equipo')}}}).fetch();
    			debugger;
    			let ids = _(_asuntos).map(function (_asunto) {
    				return _asunto._id;
    			})

                query.$and.push({'asunto.id':{$in:ids}});
    		}
        }

		return Gastos.find(query);
		// debugger;
		// var filtro = {}
		//
		// filtro['asunto.id'] = Session.get('asunto-hora')
		// filtro.fecha = $.isEmptyObject(Session.get('filtro-hora'))? {}: Session.get('filtro-hora').fecha
		//
		// return Horas.find(filtro);

	},
    tipo_gasto(){
        return !Session.get('gastos-admin');
    }
})




Template.gastos.onCreated(function () {
    let self=this;
    let bufeteId = Meteor.user().profile.bufeteId;
    Session.set('gastos-admin',false)
    Session.set('query',"")
    self.autorun(function () {
        self.subscribe('cambios',bufeteId);
        self.subscribe('recibos',bufeteId)
        if(Meteor.user().roles.bufete[0]!="administrador")  return self.subscribe('gastosxmiembro',bufeteId);
        self.subscribe('gastos',bufeteId)

    })
})


Template.gastos.events({
    'change .tipo-cambio':function (event,template) {
        return Session.set('tipo-cambio',event.target.value)
    },
    'click .gastos-administrativos'(){
        Session.set('gastos-admin',true)
    },
    'click .gastos-no-administrativos'(){
        Session.set('gastos-admin',false)
    },
    'click .asuntos'(){
		Modal.show('filtroAsuntoGastoModal',this);
	},
	'click .cliente'(){
		Modal.show('filtroClienteGastoModal');
	},
	'click .miembros'(){
		Modal.show('filtroMiembroGastoModal');
	},
    'click .todos'(){
        debugger;
        Session.set('gastos-admin',false)
		Session.set('asunto-hora',undefined);
		Session.set('filtro-hora',{})
        Session.set('asunto-hora',{})
        Session.set('miembro-equipo',{})
		Session.set('cliente-hora',"")
	},
    'click .editar-gasto'(event){
        debugger;
        Session.set('gasto-id',$(event.target).data('id'));
        Modal.show('editarGasto')
    },
	'click .eliminar-gastos'(event){
		debugger;
		swal({  title: "¿Seguro que quieres eliminar este gasto?",
				text: "Este gasto ya no estara disponible para el resto de tu equipo",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, eliminar hora",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: false
			},
			function() {
				let gastoId = $(event.target).data('id');
				Meteor.call('eliminarGasto',gastoId,function (err) {
					if(err) return Bert.alert('Hubo un error al momento de eliminar','danger');
					swal('Gasto eliminado','El gasto se elimino correctamente','success')
			})
       });
	},
    'click .editar-gasto-administrativo'(event){
        debugger;
        Session.set('gasto-id',$(event.target).data('id'));
        Modal.show('editarGastoAdministrativo')
    },
    'click .eliminar-gasto'(event){
        Modal.show('eliminarGasto');
    },
    'keyup .buscador-gastos'(event){
        Session.set('query',event.target.value);
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
})
