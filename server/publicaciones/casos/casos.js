Meteor.publish('casos2', function (bufeteId) {
	check(bufeteId, String);

	if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			return Casos.find({'bufeteId': bufeteId});

	} else {
		this.stop();
		return;
	}

});

Meteor.publish('estadisticasCasos',function(){
	var self = this;
	var casos = Casos.aggregate([{
		// assuming our Reports collection have the fields: hours, books
		"$project": {
			year:{
				'$year':"$createdAt"
			},
			month: {
				'$month': '$createdAt'
			}
		}
	}, {
		"$group": {
			_id:{
				month:"$month"
			},
			count:{
				'$sum':1
			}
		} // Send the aggregation to the 'clientReport' collection available for client use
	}]);

	_(casos).each(function(caso){
			self.added('casos',Random.id(),{
				id: caso._id,
				count:caso.count
			})
	})

	// ReactiveAggregate(this, Casos, [{
	// 	// assuming our Reports collection have the fields: hours, books
	// 	"$project": {
	// 		year:{
	// 			'$year':"$createdAt"
	// 		},
	// 		month: {
	// 			'$month': '$createdAt'
	// 		}
	// 	}
	// }, {
	// 	"$group": {
	// 		_id:{
	// 			month:"$month"
	// 		},
	// 		count:{
	// 			'$sum':1
	// 		}
	// 	} // Send the aggregation to the 'clientReport' collection available for client use
	// }], { clientCollection: "Casos" });
});

Meteor.publish('newsCasos', function (casoId) {
		check(casoId, String);

	if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			return NewsFeedCasos.find({'caso.id': casoId});

	} else {
		this.stop();
		return;
	}

});

Meteor.publish('casosNotas', function (casoId) {
	check(casoId, String);

	if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			return NotasCasos.find({'caso.id': casoId});

	} else {
		this.stop();
		return;
	}

});

Meteor.publish('newsCRM', function (bufeteId, limite) {
	check(bufeteId, String);
	check(limite, Number);
	if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return NewsFeedCasos.find({bufeteId: bufeteId}, {limit: limite, sort: {createdAt: -1}});
	}
});
