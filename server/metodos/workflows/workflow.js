Meteor.methods({
    'agregarWorkflow'(workFlow){
        check(workFlow,Object);
        workFlow.bufeteId = Meteor.users.findOne(Meteor.userId()).profile.bufeteId;
        if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
            Workflows.insert(workFlow)
		} else {
			return;
		}
    },
    'editarWorkflow'(workFlowId,workFlow){
        check(workFlowId,String)
        check(workFlow,Object);

        if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
            Workflows.update({
                _id:workFlowId
            },{
                $set:workFlow
            })
        } else {
            return;
        }
    },
    'eliminarWorkflow'(workFlowId){
        check(workFlowId,String)
        if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
            Workflows.remove(workFlowId)
        } else {
            return;
        }

    }
})
