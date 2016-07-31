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

    if (e.which === 13) {


      let tarea = {
          etapaId: this.id
      }

      $( ".tarea-1" ).each(function( index ) {

			if ( $( this ).val()  !== "") {
				tarea.descripcion = $( this ).val();
				$( this ).val("");
			}

			});

      t.tareas.push(tarea);

      t.find('[name="crear-tarea-etapa"]').value = "";

    }
  },
  'click .guardar-workflow': function (e, t) {
      let workFlow = Template.instance().etapas.get();
      Meteor.call('agregarWorkflow', workFlow);
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
    /*Template.parentData(0).id;
    return Template.instance().tareas.get();*/

    return tareas;
  }
});
