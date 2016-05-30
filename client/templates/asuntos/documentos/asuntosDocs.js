Template.docsasunto.onCreated(function () {
  var self = this;

	self.autorun(function() {

		  let asuntoId = FlowRouter.getParam('asuntoId');

    	self.subscribe('carpetasAsunto', asuntoId);
      self.subscribe('docsAsunto', asuntoId);
   });
});

Template.subdocsAsunto.onCreated(function () {
  var self = this;

	self.autorun(function() {

		  let asuntoId = FlowRouter.getParam('asuntoId');
      let carpetaId = FlowRouter.getParam('carpetaId');
      let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('subcarpetasAsunto', carpetaId);
      self.subscribe('subdocs', bufeteId, carpetaId);

   });
});

Template.subdocsAsunto.helpers({
    docs: () => {
        let result = Documentos.find({});
        return result;
    },
    carpetas: () => {
      return Carpetas.find({});
    },
    esAdministrador: () => {
  		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
  			return true;
  		} else {
  			return false;
  		}
  	},
    asuntoId: () => {
      return FlowRouter.getParam('asuntoId');
    }
});


Template.docsasunto.helpers({
    docs: () => {
        let result = Documentos.find({});
        return result;
    },
    carpetas: () => {
      return Carpetas.find({});
    },
    esAdministrador: () => {
  		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
  			return true;
  		} else {
  			return false;
  		}
  	}
});
