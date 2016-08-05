Template.workflows.onCreated(function () {
    let bufeteId = Meteor.user().profile.bufeteId;
    let self = this;
    self.autorun(function () {
        self.subscribe('workflows');
    })

})

Template.workflows.helpers({

	cantidad(){
		return Workflows.find({bufeteId:Meteor.user().profile.bufeteId}).count()
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


Template.workflows.helpers({

})

Template.tablaWorkflows.events({
    'click .editar-workflow'(event,template){

        Session.set('workflow-select-id',$(event.target).data('id'));
        Modal.show('editarWorkflowModal')

    },
    'click .eliminar-workflow'(event,template){
        swal({  title: "¿Seguro que quieres eliminar este workflow?",
                text: "Este workflow ya no estara disponible para el resto de tu equipo",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "Si, eliminar workflow",
                cancelButtonText: "No, cancelar",
                closeOnConfirm: false
            },
            function() {
                let workflowId = $(event.target).data('id');
                Meteor.call('eliminarWorkflow',workflowId,function (err) {
                    if(err) return Bert.alert('Hubo un error al momento de eliminar','danger');
                    swal('Worlflow eliminado','El workflow se elimino correctamente','success')
                });
            });
    }
})

Template.tablaWorkflows.helpers({
    workflows(){
        return Workflows.find();
    }

})
