Template.chatLikeFB.events({
	'click #live-chat header': () => {
		$('.chat').slideToggle(300, 'swing');
		$('.chat-message-counter').fadeToggle(300, 'swing');
	},
	'click .chat-close': (e, t) => {
		e.preventDefault();
		$('#live-chat').fadeOut(300);
	}
});