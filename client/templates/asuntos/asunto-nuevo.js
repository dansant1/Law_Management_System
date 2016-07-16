
Template.asuntoNuevoModal.onCreated(function () {
	var self = this;
    Session.set("cliente-asunto-id","");
	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('equipo', bufeteId);
		self.subscribe('clientes', bufeteId);
		self.subscribe('tarifas',bufeteId)
		self.subscribe('misequipos',bufeteId)
   });
});

Template.asuntoNuevoModal.onRendered( () => {
	var picker = new Pikaday({ field: document.getElementById('datepicker') });
});

Template.asuntoNuevoModal.helpers({
	miembros: () => {
		return Meteor.users.find();
	},
	clientes: () => {
		return Clientes.find();
	},
	tarifas(){
		return Tarifas.find();
	},
	equipos(){
		return Equipos.find();
	},
    elusuario(){
        debugger;
        return this._id === Meteor.userId();
    },
    ruc_cliente(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});

        return cliente.facturacion? cliente.facturacion.ruc : ''
    },
    nombre_solicitante(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});

        return cliente.facturacion? cliente.facturacion.solicitante.nombre : ''
    },
    correo_solicitante(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});

        return cliente.facturacion? cliente.facturacion.solicitante.correo : ''
    },
    direccion_facturacion(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});

        return cliente.facturacion? cliente.facturacion.direccion : ''
    },
    telefono_facturacion(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});

        return cliente.facturacion? cliente.facturacion.telefono : ''
    },
    telefono_solicitante(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});
        return cliente.facturacion? cliente.facturacion.solicitante.telefono:''
    },
    cobranza(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});
        return cliente.facturacion? cliente.facturacion.cobranza : ''
    },
    comentario(){
        let cliente = Clientes.findOne({_id:Session.get("cliente-asunto-id")});
        return cliente.facturacion? cliente.facturacion.comentario : ''
    }

});

Template.asuntoNuevoModal.events({
	'click .agregar-cliente': function (event,template) {
		Modal.show('clienteNuevoModal');
	},
    'click .cliente'(event,template){
        Session.set("cliente-asunto-id",$(event.target).val());
    },
	'click .agregar-asunto': function (event, template) {
			event.preventDefault();

			let asunto = {}
			debugger;
			asunto.cliente = {
				nombre: $(template.find( ".cliente option:selected" )).text(),
				id: $(template.find( ".cliente" )).val()
			}

			asunto.caratula = template.find( '[name="caratula"]' ).value;
			asunto.carpeta	= template.find( '[name="carpeta"]' ).value;
			asunto.equipoId = template.find('[name="equipo"]').value;

			// asunto.abogados = [];
			if(template.find("[name='ruc']").value!=""
				&& template.find("[name='direccion']").value!=""
			 	&& template.find("[name='telefono-facturacion']").value != ""
			 	&& template.find("[name='tarifa']").value!=""
				&& template.find("[name='tipo-descuento']").value!=""
				&& template.find("[name='valor-descuento']").value!=""
				//&& template.find("[name='cobranza']").value!=""
				){

					asunto.facturacion = {
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
						tipo_moneda: template.find("[name='tipo-moneda']").value,
						cobranza: template.find("[name='cobranza']").value,
						alertas:{
							horas: template.find("[name='horas']").value,
							monto: template.find("[name='monto']").value,
							horas_no_cobradas: template.find("[name='horas-no-cobradas']").value,
							monto_horas_no_cobradas: template.find("[name='monto-horas-no-cobradas']").value
						}
					}
				}


			// asunto.area		= $( ".area option:selected" ).text();
			//
			// asunto.juzgado	= template.find( '[name="juzgado"]' ).value;
			// asunto.observaciones = template.find( '[name="observaciones"]' ).value;
			// asunto.inicio	= template.find( '[name="fecha"]' ).value;

			asunto.responsable = {
				nombre: $(template.find( ".responsable option:selected" )).text(),
				id: $(template.find( ".responsable" )).val()
			}

			asunto.bufeteId = Meteor.user().profile.bufeteId;


			if (asunto.caratula !== "") {

				Meteor.call('crearAsunto', asunto, function (err, result) {
					debugger;
					if(err) return Bert.alert('Error al crear el asunto','danger');
					if(result.error) return Bert.alert(result.error,'danger')
					Modal.hide('asuntoNuevoModal')
					// template.find( '[name="caratula"]' ).value = "";
					// template.find( '[name="carpeta"]' ).value = "";
					// template.find( '[name="juzgado"]' ).value = "";
					// template.find( '[name="observaciones"]' ).value = "";
					// template.find( '[name="fecha"]' ).value = "";
					Bert.alert('Creaste un asunto', 'success');
					FlowRouter.go('/asuntos2/d/' + result.asuntoId);


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
