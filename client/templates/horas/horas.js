// Template Horas

Template.listaHoras.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('horas', bufeteId);

   });
});

Template.listaHorasxAsunto.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;
		let asuntoId = FlowRouter.getParam('asuntoId');

    	self.subscribe('horasxAsunto', bufeteId, asuntoId);

   });
});

Template.listaHorasxAsunto.helpers({
	horas: () => {
		return Horas.find({});
	},
	hayhoras: () => {
		if ( Horas.find().fetch().length > 0 ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.horas.events({
    "click #generate-pdf": function (){

	let externalDataRetrievedFromServer = []

	let horas = Horas.find().map(function (i) {
		externalDataRetrievedFromServer.push({"Fecha": i.fecha, "Responsable": i.responsable.nombre,"Descripción": i.descripcion, "Horas": i.horas, "Costo (S/)": i.precio,"Total (S/)": i.total});
	});


	function buildTableBody(data, columns) {
    	var body = [];

    	body.push(columns);

    	data.forEach(function(row) {
        	var dataRow = [];

        	columns.forEach(function(column) {
            	dataRow.push(row[column].toString());
        	})

        	body.push(dataRow);
    	});

    	return body;
	}

		function table(data, columns) {
    		return {
        		table: {
            		headerRows: 1,
            		widths: [90, 100, 100, '*', 75, 75],
            		body: buildTableBody(data, columns)
        		}
    		};
		}

		var dd = {
			pageSize: 'A4',
			pageMargins: [ 30, 25, 30, 25 ],
    		content: [
    				{
						stack: [
							'Susana Valladares Caballero',
							{ text: 'Lima, Perú', style: 'subheader' },
						],
						style: 'header'
					},
    			{
						table: {
								body: [
										['Factura #', '00374'],
										['Fecha de facturación', '08 Mayo, 2016'],
										['Balance total', 'S/ 100'],
										['Asunto', 'Daños y Perjuicios c/ empresa SA']
								]
						}
				},
        		{ text: 'Horas', style: 'header' },
        		table(externalDataRetrievedFromServer, ['Fecha', 'Responsable','Descripción', 'Horas', 'Costo (S/)','Total (S/)']),
        		{ text: '', style: 'header' },
        		{
						table: {
								style: 'header',
								body: [
										['Costo total de horas', '100'],
										['Sub total', '100'],
										['Total', 'S/ 100']
								]
						}
				}
    		],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					alignment: 'right',
					margin: [50,45,0,18]
				},
				subheader: {
					fontSize: 14
				},
				superMargin: {
					margin: [20, 0, 40, 0],
					fontSize: 15,
				}
			}
		}

		// Inicio del proceso de genereacion de pdf
		pdfMake.createPdf(dd).open();

		swal(	"¡Listo!",
  				"Tu factura se generó con exito.",
  				"success");
}});

Template.listaHoras.helpers({
	horas: () => {
		return Horas.find({});
	},
	hayhoras: () => {
		if ( Horas.find().fetch().length > 0 ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.nuevoHoras.events({
	'click a.horas': function (event, template) {
		event.preventDefault();
		Modal.show('agregarHoras');
	},
	'click a.gastos': function (event, template) {
		event.preventDefault();
		Modal.show('agregarGasto');
	}
});

Template.agregarHoras.onRendered(function () {
	debugger;
	let template = this;
	if(Session.get("cronometro-pausado")){
		$(template.find("[name='horas']")).val(chronometer.hours);
		$(template.find("[name='minutos']")).val(chronometer.minutes);
	}
	Meteor.typeahead.inject();
	var picker = new Pikaday({ field: document.getElementById('datepicker') });

	$('#tarea-typeahead').bind('typeahead:selected', function(obj, datum, name) {
		Session.set("tarea-hora",datum)
	});
});

Template.agregarHoras2.onRendered(function () {
	if(Session.get("cronometro-pausado")){
		$("#agregar-horas-modal").find("[name='horas']").val(chronometer.hours);
		$("#agregar-horas-modal").find("[name='minutos']").val(chronometer.minutes);
	}
	Meteor.typeahead.inject();
	var picker = new Pikaday({ field: document.getElementById('datepicker') });

	$('#tarea-typeahead').bind('typeahead:selected', function(obj, datum, name) {
		Session.set("tarea-hora",datum)
	});
});

Template.facturacion.onRendered(function(){
	var self = this;
	var bufeteId = Meteor.user().profile.bufeteId
	Session.set('filtro-hora',{})

	self.autorun(function(){
		// debugger;
		self.subscribe('cambios',bufeteId)
		if(Meteor.user().roles.bufete[0]=="administrador") return self.subscribe('horas',bufeteId)
		return self.subscribe('horasxmiembro',bufeteId,Meteor.userId())
	})
})

Template.facturacion.onCreated(function () {
	Session.set('buscador-valor',"");

	let self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	self.autorun(function () {
		self.subscribe('tarifas',bufeteId);
		self.subscribe('cambios',bufeteId);
	})
})

function totalHorasAcumuladas(asuntoId) {

	var horas = Horas.find({'asunto.id':asuntoId,cobrable:true}).fetch();
	var asunto = Asuntos.findOne({_id:asuntoId});
	var grupos = _(horas).groupBy(function (hora) {
		return hora.asunto.id;
	})
	// debugger;
	var tiempoxAsunto = _(grupos).map(function (g,key) {
		return {
				type:key,
				horas: _(g).reduce(function (m,x) {
					return m + x.horas;
				},0),
				minutos: _(g).reduce(function (m,x) {
					debugger
					return m + x.minutos;
				},0)
			}
	})

	for (var i = 0; i < tiempoxAsunto.length; i++) {

		if(tiempoxAsunto[i].minutos>=60){
			let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
			tiempoxAsunto[i].horas += horas;
			tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
		}
	}

	if(tiempoxAsunto[0])  return tiempoxAsunto[0].horas;
	return 0;
}


function calcularTarifa(trabajo) {
	let asunto = Asuntos.findOne({_id:trabajo.asunto.id}),
		tarifa = Tarifas.findOne({_id:asunto.facturacion.tarifa.id}),
		cambio = Cambio.findOne({bufeteId:trabajo.bufeteId}),
		precio;



	tarifa.miembros.some(function (miembro) {
		if(miembro.id==trabajo.responsable.id){
			let costoxminuto, costoxhora;

			if(trabajo.diferencia)	costoxhora = miembro.soles*trabajo.diferencia;
			else costoxhora = miembro.soles*trabajo.horas;

			costoxminuto = (miembro.soles/60)*trabajo.minutos;

			return precio = Number(costoxhora) + Number(costoxminuto);
		}
	})

	if(!precio){
		let user = Meteor.users.findOne({_id:trabajo.responsable.id});
		tarifa.roles.some(function (roles) {
			let costoxminuto, costoxhora;
			if(user.roles.bufete.length==1)
				if(user.roles.bufete[0]==roles.nombre){

					if(trabajo.diferencia)	costoxhora = miembro.soles*trabajo.diferencia;
					else costoxhora = miembro.soles*trabajo.horas;
					costoxminuto = (roles.soles/60)*trabajo.minutos;

					return precio = Number(costoxhora) + Number(costoxminuto);

				}
			else {
				if(user.roles.bufete[1]==roles.nombre){
					if(trabajo.diferencia)	costoxhora = miembro.soles*trabajo.diferencia;
					else costoxhora = miembro.soles*trabajo.horas;

					costoxminuto = (roles.soles/60)*trabajo.minutos;
					return precio =  Number(costoxhora) + Number(costoxminuto);
				}
			}
		})
	}

	return precio;

}

function calcularPorTipoDeCobro(trabajo) {
	let precio,
		asunto = Asuntos.findOne({_id:trabajo.asunto.id})
	debugger;
	if(asunto.facturacion.forma_cobro=="horas hombre") return calcularTarifa(trabajo).toFixed(2)
	if(asunto.forma_cobro=="flat fee") return "";

	if(asunto.facturacion.forma_cobro=="retainer"){

			
			debugger;
		if(trabajo.sobrelimite) return calcularTarifa(trabajo).toFixed(2)
		return;
	}

	return precio;
}

Template.facturacion.helpers({
	email() {
		return Meteor.user().emails[0].address
	},
	precio(){
		debugger;
		let self = this;
		debugger;
		let precio = calcularPorTipoDeCobro(self);
		if(precio!=undefined){
			if(Session.get('tipo-cambio')!="dolares") return "S/ "+ precio;
			return "$ " + (precio/Cambio.findOne({bufeteId:Meteor.user().profile.bufeteId}).cambio).toFixed(2);
		}
		return;
	},
	moneda(){
		// debugger;
		let asunto = Asuntos.find({_id:this.asunto.id}).fetch[0];
		return (asunto.facturacion.tipo_moneda == "soles")? "S/." : "$";
	},
	horas(){
		// debugger;
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

			}
			else {
				query.$and = []
				query.$and.push({
					'asunto.id':{
						$in:asuntosId
					}
				})

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
			// debugger;
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


	},
	cliente(){
		return Asuntos.find({_id:this.asunto.id}).fetch()[0].cliente.nombre;
	},
	esAdministradoroEncargado(){
		return Meteor.user().roles.bufete.indexOf("administrador")>=0||Meteor.user().roles.bufete.indexOf("encargado comercial")>=0;
	},
	tipo_cambio(){
		// debugger;
		if(Asuntos.find({_id:this.asunto.id}).fetch()[0].facturacion.tipo_moneda == "soles") return "S/. "
		return "$ "
	}
});

Template.menuBotonesFacturacion.events({
	'click .agregar-gasto'(){
		Modal.show('agregarGasto2')
	},
	'click .agregar-hora'(){
		Modal.show('agregarHoras')
	},
	'click .agregar-gasto-administrativo': function (event,template) {
        Modal.show('agregarGastoAdministrativo2')
    },
	'click .agregar-tipo-cambio'(){
		Modal.show('agregarTipoCambio')
	},
	'click .agregar-tarifa'() {
		Modal.show('crearTarifaModal');
	}

})

Template.facturacion.events({
	'click .agregar-descripcion'(){
		Modal.show('agregarDescripcionHorasModal',this);
	},
	'click .agregar-asunto'(){
		Modal.show('agregarAsuntoHorasModal',this)
	},
	'change .tipo-cambio'(event,template) {
        return Session.set('tipo-cambio',event.target.value)
    },
	'click .todos'(){
		Session.set('asunto-hora',undefined);
		Session.set('filtro-hora',{})
		Session.set('cliente-hora',undefined)
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
	'click .editar-hora'(event,template){
		// debugger;
		Session.set('hora-id',$(event.target).data('id'));
		Modal.show('editarHoraModal',this)
	},
	'click .eliminar-hora'(event,template){
		// debugger;
		swal({  title: "¿Seguro que quieres eliminar esta hora?",
				text: "Esta hora ya no estara disponible para el resto de tu equipo",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#e74c3c",
				confirmButtonText: "Si, eliminar hora",
				cancelButtonText: "No, cancelar",
				closeOnConfirm: false
			},
			function() {
				let horaId = $(event.target).data('id');
				Meteor.call('eliminarHora',horaId,function (err) {
					if(err) return Bert.alert('Hubo un error al momento de eliminar','danger');
					swal('Hora eliminada','La hora se elimino correctamente','success')
				})

				swal("Asunto cerrado", "El asunto ha sido cerrado correctamente.", "success");
			});
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



Template.agregarHoras.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);

// <<<<<<< HEAD
// =======
//    });
// });
//
// Template.agregarHoras2.onCreated(function () {
// 	var self = this;
//
// 	self.autorun(function() {
//
// 		let bufeteId = Meteor.user().profile.bufeteId;
//
//     	self.subscribe('equipo', bufeteId);
//
// >>>>>>> fa1b06772e023a3099e618a33900604162868e6c
   });
});

Template.agregarHoras.helpers({
	asunto: () => {
		debugger;
		Session.set('asunto-select-id',Asuntos.findOne({abogados:{$elemMatch:{id:Meteor.userId()}}})._id);
		return Asuntos.find({abierto:true,abogados:{$elemMatch:{id:Meteor.userId()}}});
	},
	responsable: () => {

		return Asuntos.findOne({_id:Session.get('asunto-select-id')}).abogados;
	},
	tareasHoras(){
		return Tareas.find({horas:{$exists:false}}).fetch().map(function(tarea){ return {id: tarea._id, value: tarea.descripcion}; });
	},
	selected(event, suggestion, datasetName) {

// <<<<<<< HEAD
// =======
// 	    console.log(suggestion.id);
// 	}
// });
//
// Template.agregarHoras2.helpers({
// 	asunto: () => {
// 		Session.set('asunto-select-id',Asuntos.findOne({abogados:{$elemMatch:{id:Meteor.userId()}}})._id);
// 		return Asuntos.find({abierto:true,abogados:{$elemMatch:{id:Meteor.userId()}}});
// 	},
// 	responsable: () => {
//
// 		return Asuntos.findOne({_id:Session.get('asunto-select-id')}).abogados;
// 	},
// 	tareasHoras(){
// 		return Tareas.find({horas:{$exists:false}}).fetch().map(function(tarea){ return {id: tarea._id, value: tarea.descripcion}; });
// 	},
// 	selected(event, suggestion, datasetName) {
//
// >>>>>>> fa1b06772e023a3099e618a33900604162868e6c
	    console.log(suggestion.id);
	}
});

Template.agregarHoras.events({
	'change #tarea-select'(event,template){
		if($(event.target).is(":checked")){
			$(template.find(".descripcion-tarea")).addClass('hide');
			$(template.find(".buscar-tarea")).removeClass('hide')
		}else {
			$(template.find(".descripcion-tarea")).removeClass('hide');
			$(template.find(".buscar-tarea")).addClass('hide')
		}

	},
	'change [name="asunto"]'(event,template){
		Session.set('asunto-select-id',event.target.value);
	},
	'submit form': function (event, template) {
		event.preventDefault();
		// debugger;
		let datos = {
			descripcion: template.find('[name="descripcion"]').value,
			fecha: template.find('[name="fecha"]').value,
			bufeteId: Meteor.user().profile.bufeteId,
			horas: template.find('[name="horas"]').value,
			minutos: template.find('[name="minutos"]').value,
			cobrado: $(".cobrado").is(":checked"),
			esTarea: $(".es-tarea").is(":checked"),
			creador: {
				id: Meteor.user()._id,
				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
			}
		}

		if($(".es-tarea").is(":checked")) datos.tarea = {
			id: Session.get('tarea-hora').id,
			nombre: Session.get('tarea-hora').value
		}


		// debugger;
		datos.asunto = {
			nombre: Asuntos.findOne({_id:template.find(".asunto").value}).caratula,
			id: template.find(".asunto").value
		}

		datos.responsable = {
			nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
			id: Meteor.userId()
		}

		if (datos.horas !== "" && datos.asunto !== undefined && datos.fecha !== "") {

			if (datos.minutos === "") {
				datos.minutos = 0;
			}


			Meteor.call('agregarHora', datos, function (err, result) {
				if (err) {

					return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
					Modal.hide('agregarHoras');
				}

				if(Session.get("cronometro-pausado")) chronometer.reset();
				Modal.hide('agregarHoras');
				Bert.alert('Agregaste horas', 'success');

// <<<<<<< HEAD
// =======
// 			});
//
// 		} else {
// 			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
// 		}
// 	}
// });
//
// Template.agregarHoras2.events({
// 	'change #tarea-select'(event,template){
// 		if($(event.target).is(":checked")){
// 			$(template.find(".descripcion-tarea")).addClass('hide');
// 			$(template.find(".buscar-tarea")).removeClass('hide')
// 		}else {
// 			$(template.find(".descripcion-tarea")).removeClass('hide');
// 			$(template.find(".buscar-tarea")).addClass('hide')
// 		}
//
// 	},
// 	'change [name="asunto"]'(event,template){
// 		Session.set('asunto-select-id',event.target.value);
// 	},
// 	'click .agregar-trabajo': function (event, template) {
// 		event.preventDefault();
// 		debugger;
// 		let datos = {
// 			descripcion: template.find('[name="descripcion"]').value,
// 			fecha: template.find('[name="fecha"]').value,
// 			bufeteId: Meteor.user().profile.bufeteId,
// 			horas: template.find('[name="horas"]').value,
// 			minutos: template.find('[name="minutos"]').value,
// 			cobrado: $(".cobrado").is(":checked"),
// 			esTarea: $(".es-tarea").is(":checked"),
// 			creador: {
// 				id: Meteor.user()._id,
// 				nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
// 			}
// 		}
//
// 		if($(".es-tarea").is(":checked")) datos.tarea = {
// 			id: Session.get('tarea-hora').id,
// 			nombre: Session.get('tarea-hora').value
// 		}
//
//
// 		debugger;
// 		datos.asunto = {
// 			nombre: template.find( ".asunto option:selected" ).innerHTML,
// 			id: template.find(".asunto").value
// 		}
//
// 		datos.responsable = {
// 			nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido,
// 			id: Meteor.userId()
// 		}
//
// 		if (datos.horas !== "" && datos.asunto !== undefined && datos.fecha !== "") {
//
// 			if (datos.minutos === "") {
// 				datos.minutos = 0;
// 			}
//
//
// 			Meteor.call('agregarHora', datos, function (err, result) {
// 				if (err) {
//
// 					return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
// 					Modal.hide('agregarHoras');
// 				}
//
// 				if(Session.get("cronometro-pausado")) chronometer.reset();
// 				Modal.hide('agregarHoras2');
// 				Bert.alert('Agregaste horas', 'success');
//
// >>>>>>> fa1b06772e023a3099e618a33900604162868e6c
			});

		} else {
			Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
		}
	}
});


// Template Gastos

Template.listaGastos.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('gastos', bufeteId);
   });
});

Template.listaGastos.helpers({
	gastos: function () {
		return Gastos.find({});
	}
});

Template.listaGastosxAsunto.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;
		let asuntoId = FlowRouter.getParam('asuntoId');
    	self.subscribe('gastosxAsunto', bufeteId, asuntoId);
   });
});

Template.listaGastosxAsunto.helpers({
	gastos: function () {
		return Gastos.find({});
	},
	haygastos: () => {
		if ( Gastos.find().fetch().length > 0 ) {
			return true;
		} else {
			return false;
		}
	}
});

Template.agregarDescripcionHorasModal.events({
	'click .agregar-descripcion'(event,template){
		event.preventDefault();
		let id = this._id;
		let descripcion = template.find("[name='descripcion']").value
		let datos = {
			id: id,
			descripcion: descripcion
		}

		Meteor.call('actualizarDescripcion',datos,function (err) {
			if(err) return Bert.alert('Hubo un error al actualizar la descripcion','danger')
			Bert.alert('Se actualizo la descripcion correctamente','success')
			Modal.hide('agregarDescripcionHorasModal')
		})

	}
})

Template.agregarAsuntoHorasModal.helpers({
	asunto(){
		return Asuntos.find();
	}
})

Template.agregarAsuntoHorasModal.events({
	'click .agregar-asunto'(event,template){
		event.preventDefault();
		var data = {}
		let id = this._id;
		let asunto = {
			id: template.find(".asunto").value,
			nombre: template.find(".asunto :selected").innerHTML
		}

		data.id = id;
		data.asunto = asunto;

		Meteor.call('actualizarAsunto',data,function (err) {
			if(err) return Bert.alert('Hubo un error al actualizar el asunto','danger')
			Bert.alert('Se actualizo el asunto correctamente','success')
			Modal.hide('agregarAsuntoHorasModal')
		})
	}
})
