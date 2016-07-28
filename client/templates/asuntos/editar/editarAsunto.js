Template.editarAsuntoModal.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('tarifas',bufeteId)
        self.subscribe('misequipos',bufeteId)
    })
})

Template.editarAsuntoModal.onRendered(function () {
    let bufeteId  = Meteor.user().profile.bufeteId;
    let template = this;
    debugger;
    let asunto = Asuntos.findOne({_id:Session.get('asunto-escogido-id')});
    template.find("[name='caratula']").value = asunto.caratula;
    $(template.find("[name='equipo'] option[value='"+ (asunto.equipo.id? asunto.equipo.id:'') + "'] ")).prop('selected',true);
    $(template.find(".cliente option[value='"+ asunto.cliente.id +"']")).prop('selected',true);
    $(template.find(".responsable option[value='"+ asunto.responsable.id + "']")).prop('selected',true)
    $(template.find("[name='forma-cobro'] option[value='"+ asunto.facturacion.forma_cobro + "'] ")).prop('selected',true);
    $(template.find(".tarifa-campo")).addClass("hide");
    if(asunto.facturacion.forma_cobro=="horas hombre"){
        $(template.find(".tarifa-campo")).removeClass("hide")
        $(template.find("[name='tarifa-h'] option[value='" + asunto.facturacion.tarifa.id  + "'] ")).prop('selected',true)
        $(".tipo-cambio-hh").prop('checked',asunto.facturacion.tipo_moneda == "dolares")
    }
    if(asunto.facturacion.forma_cobro=="flat fee"){
        $(template.find(".flatfee-campo")).removeClass("hide")
        template.find("[name='montogeneral']").value = asunto.facturacion.montogeneral;
        $(".tipo-cambio-ff").prop('checked',asunto.facturacion.tipo_moneda == "dolares")
    }
    if(asunto.facturacion.forma_cobro=="retainer"){
        $(template.find(".retainer-campo")).removeClass("hide")
        template.find("[name='maximo_horas']").value = asunto.facturacion.retainer.horas_maxima;
        template.find("[name='monto_cobro']").value = asunto.facturacion.retainer.monto;
        $(".tipo-cambio-r").prop('checked',asunto.facturacion.tipo_moneda == "dolares")
        $(template.find("[name='tarifa-r'] option[value='" + asunto.facturacion.tarifa.id  + "'] ")).prop('selected',true)
    }

    template.find("[name='ruc']").value= asunto.facturacion.ruc? asunto.facturacion.ruc : '';
    template.find("[name='nombre-solicitante']").value = asunto.facturacion.solicitante.nombre? asunto.facturacion.solicitante.nombre:'';
    template.find("[name='correo-solicitante']").value = asunto.facturacion.solicitante.correo? asunto.facturacion.solicitante.correo : '';
    template.find("[name='telefono-solicitante']").value = asunto.facturacion.solicitante.telefono? asunto.facturacion.solicitante.telefono:'';
    template.find("[name='telefono-facturacion']").value = asunto.facturacion.telefono? asunto.facturacion.telefono:'';
    template.find("[name='cobranza']").value = asunto.facturacion.cobranza? asunto.facturacion.cobranza:'';
    $(template.find("[name='tipo-descuento'] option[value='"+ asunto.facturacion.descuento.tipo + "'] ")).prop('selected',true);
    template.find("[name='tipo-descuento']").value = asunto.facturacion.descuento.tipo? asunto.facturacion.descuento.tipo:'';
    template.find("[name='valor-descuento']").value = asunto.facturacion.descuento.valor? asunto.facturacion.descuento.valor:'';
    template.find("[name='carpeta']").value = asunto.carpeta? asunto.carpeta:'';
    template.find("[name='juzgado']").value = asunto.juzgado? asunto.juzgado:'';
    //
    //
    // template.find("[name='']"

})

Template.editarAsuntoModal.helpers({
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
    }
})

Template.editarAsuntoModal.events({
    'click .editar-asunto':function (event,template) {
        event.preventDefault();

        let asunto = {}
        asunto.cliente = {
            nombre: $(template.find( ".cliente option:selected" )).text(),
            id: $(template.find( ".cliente" )).val()
        }

        asunto.caratula = template.find( '[name="caratula"]' ).value;
        asunto.carpeta	= template.find( '[name="carpeta"]' ).value;
        asunto.equipoId = template.find('[name="equipo"]').value;

        // asunto.abogados = [];

        if(template.find("[name='forma-cobro']").value=="") return Bert.alert("Por favor complete la forma de cobro antes de continuar",'warning');
        asunto.facturacion = {
            ruc: template.find("[name='ruc']").value || "",
            direccion: template.find("[name='direccion']").value || "",
            telefono: template.find("[name='telefono-facturacion']").value || "",
            solicitante:{
                nombre: template.find("[name='nombre-solicitante']").value || "",
                telefono: template.find("[name='telefono-solicitante']").value || "",
                correo: template.find("[name='correo-solicitante']").value || ""
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



        if(template.find('[name="forma-cobro"]').value=="horas hombre"){
            asunto.facturacion.tipo_moneda =  $(template.find(".tipo-cambio-hh")).is(":checked")? 'dolares':'soles';
            asunto.facturacion.tarifa = {
                id:template.find("[name='tarifa-h']").value,
                nombre: $(template.find("[name='tarifa-h']")).find("option:selected").html()
            }
        }

        if(template.find('[name="forma-cobro"]').value=="flat fee"){
            asunto.facturacion.tipo_moneda =  $(template.find(".tipo-cambio-f")).is(":checked")? 'dolares':'soles';
            asunto.facturacion.montogeneral = template.find("[name='montogeneral']").value
        }

        if(template.find('[name="forma-cobro"]').value=="retainer"){
            asunto.facturacion.retainer = {}
            asunto.facturacion.tipo_moneda =  $(template.find(".tipo-cambio-r")).is(":checked")? 'dolares':'soles';
            asunto.facturacion.retainer.monto = template.find('[name="monto_cobro"]').value;
            asunto.facturacion.retainer.horas_maxima = template.find('[name="maximo_horas"]').value;
            asunto.facturacion.tarifa = {
                id:template.find("[name='tarifa-r']").value,
                nombre: $(template.find("[name='tarifa-r']")).find("option:selected").html()
            }
        }


        // asunto.area		= $( ".area option:selected" ).text();
        //
        // asunto.juzgado	= template.find( '[name="juzgado"]' ).value;
        // asunto.observaciones = template.find( '[name="observaciones"]' ).value;
        // asunto.inicio	= template.find( '[name="fecha"]' ).value;
        let userSelected = Meteor.users.findOne({_id:$(template.find(".responsable")).val()})
        asunto.responsable = {
            nombre: userSelected.profile.nombre + " " + userSelected.profile.apellido,
            id: $(template.find( ".responsable" )).val()
        }

        asunto.bufeteId = Meteor.user().profile.bufeteId;


        if (asunto.caratula !== "") {

            Meteor.call('editarAsunto', asunto, Session.get('asunto-escogido-id'),  function (err, result) {
                debugger;
                if(err) return Bert.alert('Error al crear el asunto','danger');
                // if(result.error) return Bert.alert(result.error,'danger')
                Modal.hide('editarAsuntoModal')
                // template.find( '[name="caratula"]' ).value = "";
                // template.find( '[name="carpeta"]' ).value = "";
                // template.find( '[name="juzgado"]' ).value = "";
                // template.find( '[name="observaciones"]' ).value = "";
                // template.find( '[name="fecha"]' ).value = "";
                Bert.alert('Editaste el asunto', 'success');
                // FlowRouter.go('/asuntos2/d/' + result.asuntoId);


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
    },
	'change [name="forma-cobro"]'(event,template){
		debugger;
		$(".cobro").addClass("hide");
		if(event.target.value=="horas hombre")	$(".tarifa-campo").removeClass("hide");
		if(event.target.value=="flat fee") $(".flatfee-campo").removeClass("hide");
		if(event.target.value=="retainer") $(".retainer-campo").removeClass("hide");
	}
})
