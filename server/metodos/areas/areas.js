Meteor.methods({
    'agregarArea'(data){
        check(data,{
            nombre:String,
            bufeteId:String
        })

        if ( Roles.userIsInRole(this.userId, ['administrador'], 'bufete') ) return Areas.insert(data)
        
    }
})
