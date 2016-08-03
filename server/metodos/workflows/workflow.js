Meteor.methods({
    'agregarWorkflow'(workFlow){
        check(workFlow,Object);
        workFlow.bufeteId = Meteor.users.findOne(Meteor.userId()).profile.bufeteId;
        if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
            Workflows.insert(workFlow)
		} else {
			return;
		}

    }
})
