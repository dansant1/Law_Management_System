Template.subMenu.events({
	'click li': function () {
        
        $(this).click(function(){
            $('.active').removeClass('active');
            $(this).addClass('active');
        });
	
	}
});

