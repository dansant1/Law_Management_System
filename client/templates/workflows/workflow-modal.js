Template.workflowModal.onCreated(function () {
  this.etapas  = new ReactiveArray();
  this.tareas  = new ReactiveArray();
  this.etapaId = new ReactiveVar( 0 );
});

Template.workflowModal.onRendered(function () {});

Template.workflowModal.events({
  'keyup .etapa-1': function (e, t) {
    e.preventDefault();
    if (e.which === 13) {

      let etapa = {
          nombre: t.find('[name="nombre-etapa"]').value,
          id: t.etapaId.get()
      }

      t.etapas.push(etapa);
      t.etapaId.set(t.etapaId.get() + 1);
      t.find('[name="nombre-etapa"]').value = "";

    }
  },
  'keyup .tarea-1': function (e, t) {
    e.preventDefault();
    debugger;
    if (e.which == 13) {
        let tarea = {
            etapaId: this.id
        }
		if ( $(e.target).val()!=="") {
		    tarea.descripcion = $(e.target).val();
            tarea.duracion = Number($(e.target).parent().find("[name='duracion-tarea']").val());
            $(e.target).parent().find("[name='duracion-tarea']").val("")
			$(e.target).val("");
		}
        t.tareas.push(tarea);
    }
  },
  'keyup [name="duracion-tarea"]':function (e,t) {
    e.preventDefault();
    if (e.which==13) {
        if($(e.target).parent().find(".tarea-1").val()=="") return Bert.alert('Escriba la descripcion de la tarea','warning')

        let tarea = {
            etapaId: this.id
        }
		if ( $(e.target).val()!=="") {
		    tarea.descripcion = $(e.target).parent().find(".tarea-1").val();
            tarea.duracion = Number(e.target.value);
            $(e.target).parent().find(".tarea-1").val("")
			$(e.target).val("");
		}
        t.tareas.push(tarea);
    }
  },
  'click .guardar-workflow': function (e, t) {
      debugger;

      let workFlow = {}

      let _etapas  = Template.instance().etapas.get()
      let _tareas = Template.instance().tareas.get();
      let etapas =  _etapas.map(function (etapa) {
          let tareas = _tareas.filter(function (tarea) {
              return tarea.etapaId == etapa.id
          })
          etapa.tareas = tareas;
          return etapa;
      })

      workFlow.nombre = t.find("[name='nombre-workflow']").value;
      workFlow.etapas = etapas;
      workFlow.creador = {
          id:Meteor.userId(),
          nombre: Meteor.user().profile.nombre + " " + Meteor.user().profile.apellido
      }

      Meteor.call('agregarWorkflow', workFlow,function (err) {
          if(err) return Bert.alert('Hubo un error al momento de registrar el workflow','danger')
          Bert.alert('Se registro correctamente el workflow','success');
          Modal.hide('workflowModal');
      });
  }
});

Template.workflowModal.helpers({
  etapas() {
    return Template.instance().etapas.get();
  },
  tareas() {
    var tareas = Template.instance().tareas.get().filter(function( task ) {
        return task.etapaId == Template.parentData(0).id;
    });
    return tareas;
  }
});
