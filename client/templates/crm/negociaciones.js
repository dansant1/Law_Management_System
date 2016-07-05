Template.listaNegociacionesCRM.onCreated(function () {
	var self = this;

	self.autorun(function() {

		let bufeteId = Meteor.user().profile.bufeteId;

    	self.subscribe('casos2', bufeteId);
   });
});

Template.listaNegociacionesCRM.helpers({
	casos() {
		return Casos.find({}, {sort: {createdAt: -1}});
	}
})