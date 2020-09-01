jQuery(document).ready(function(){

	jQuery('.show_nav').click(function() {
		jQuery('.nav_top').slideToggle(100);
		jQuery(this).toggleClass('open');
		return false;
	});



	jQuery('.show_bot_nav').click(function() {
		jQuery('.nav_bot').slideToggle(100);
		jQuery(this).toggleClass('open');
		return false;
	});



	jQuery('.show_search').click(function() {
		jQuery('.search').addClass('open');
		jQuery('.header-docs').addClass('hidden');
		return false;
	});
	jQuery(document).click( function(event){
		if( jQuery(event.target).closest(".top_search").length )
		return;
		jQuery(".search").removeClass('open');
		jQuery('.header-docs').removeClass('hidden');
		event.stopPropagation();
	});



	jQuery('.sub_nav').hover(
	function() {
		jQuery(this).find('.nav_top_sub').fadeIn(100);
	},
	function() {
		jQuery(this).find('.nav_top_sub').fadeOut(100);
	});

    jQuery('.header-lang-mobile').click(function() {
        jQuery('.header-lang-mobile').toggleClass('open');
    });

    jQuery(document).click(function(e) {
        if (jQuery(e.target).parents().filter('.header-lang-mobile').length == 0) {
            jQuery('.header-lang-mobile').removeClass('open');
        }
    });

	jQuery('.top_user').hover(
	function() {
		jQuery(this).find('ul').fadeIn(100);
	},
	function() {
		jQuery(this).find('ul').fadeOut(100);
	});

});