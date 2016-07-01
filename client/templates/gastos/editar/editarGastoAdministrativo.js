Template.editarGastoAdministrativo.events({
    'submit form'(event,template){
        event.preventDefault();

        let datos = {
            descripcion: template.find('[name="descripcion"]').value,
            fecha: template.find('[name="fecha"]').value,
            bufeteId: Meteor.user().profile.bufeteId,
            monto: template.find('[name="precio"]').value
        }



        if (datos.monto !== "" && datos.asunto !== undefined && datos.fecha !== "" && datos.descripcion !== "") {

            Meteor.call('actualizarGastoAdministrativo', datos, Session.get('gasto-id'), function (err, result) {
                if(err) return Bert.alert('Algo salió mal, vuelve a intentarlo', 'warning');
                let archivo = template.find('[name="recibo"]');

                if ('files' in archivo) {
                  for (var i = 0; i < archivo.files.length; i++) {
                      var filei = archivo.files[i];
                        debugger;
                        var doc = new FS.File(filei);

                        doc.metadata = {
                            creadorId: Meteor.userId(),
                            bufeteId: Meteor.user().profile.bufeteId,
                            descripcion: datos.descripcion,
                            gastoId: result.gastoId,
                        };

                        Documentos.update({},doc, function (err, fileObj) {
                          if (err) return Bert.alert('Hubo un problema', 'warning');
                        })
                    }
                }

                Modal.hide('agregarGasto');
                Bert.alert('Actualizaste un gasto', 'success');
            });

        } else {
            Bert.alert('Completa los datos, y luego vuelve a intentarlo', 'warning');
        }
    }
})

Template.editarGastoAdministrativo.helpers({
    asunto(){
        return Asuntos.find();
    },
    responsable(){
        return Asuntos.findOne({_id:Session.get('asunto-select-id')}).abogados;
    }
})

Template.editarGastoAdministrativo.onCreated(function () {

})

Template.editarGastoAdministrativo.onRendered(function () {
    let template = this;
    debugger;
    let gasto = Gastos.findOne({_id:Session.get('gasto-id')})

    var picker = new Pikaday({ field: document.getElementById('datepicker') });

    template.find("[name='descripcion']").value = gasto.descripcion;
    template.find("[name='fecha']").value= formatearFecha(gasto.fecha);
    // template.find("[name='horas']").value= hora.horas;
    template.find("[name='precio']").value=gasto.monto;

})
