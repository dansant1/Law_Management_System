Meteor.methods({
	'add-slice': function () {
		Slices.insert({
			value:Math.floor(Math.random() * 100)
		});
	},
	'remove-slice': function () {
		var toRemove = Random.choice(Slices.find().fetch());
		Slices.remove({_id:toRemove._id});
	},
	'random-slice': function () {
		Slices.find({}).forEach(function(bar){
			//update the value of the bar
			Slices.update({_id:bar._id},{$set:{value:Math.floor(Math.random() * 100)}});
		});
	}
});

Meteor.methods({
	'add-bar': function () {
		Bars.insert({
			value:Math.floor(Math.random() * 25)
		});
	},
	'remove-bar': function () {
		var toRemove = Random.choice(Bars.find().fetch());
		Bars.remove({_id:toRemove._id});
	},
	'random-bar': function () {
		//loop through bars
		Bars.find({}).forEach(function(bar){
			//update the value of the bar
			Bars.update({_id:bar._id},{$set:{value:Math.floor(Math.random() * 25)}});
		});
	}
});