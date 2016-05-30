Meteor.publish('news', function (bufeteId, limite) {
	check(bufeteId, String);
	check(limite, Number);
	if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return NewsFeed.find({bufeteId: bufeteId}, {limit: limite, sort: {createdAt: -1}});
	}
});