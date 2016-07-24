Template.ModalClienteNuevo2.onCreated(function () {
	var self = this;
	let bufeteId = Meteor.user().profile.bufeteId;
	self.autorun(function () {
		self.subscribe('tarifas',bufeteId)
	})
});

Template.ModalClienteNuevo2.events({
	'click .agregar-contacto'(event, template) {
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
			/*&& template.find("[name='direccion']").value!=""
			&& template.find("[name='telefono-facturacion']").value != ""
			&& template.find("[name='tarifa']").value!=""
			&& template.find("[name='tipo-descuento']").value!=""
			&& template.find("[name='valor-descuento']").value!=""*/
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


		if (datos.nombre !== "") {
			Meteor.call('crearCliente', datos, function (err, result) {
				//debugger;
				if (err) {
					console.log(err);

				} else {
					/*template.find('[name="nombre"]').value = "";
					template.find('[name="apellido"]').value ="" ;
					template.find('[name="direccion"]').value = "";
					template.find('[name="telefono"]').value = "";
					template.find('[name="celular"]').value = "";
					template.find('[name="email"]').value = "";
					template.find('[name="identificacion"]').value = "";
					template.find('[name="provincia"]').value = "";
					template.find('[name="pais"]').value = "";*/
					Modal.hide('ModalClienteNuevo2');
				}
			});
		} else {
			Bert.alert( 'Ingrese correctamente los datos', 'warning' );
		}
	}
});

Template.ModalClienteNuevo2.helpers({
	tarifas(){
		return Tarifas.find();
	}
});
