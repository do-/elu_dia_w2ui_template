(function () {

	$.getScript ($_SESSION.get ('staticRoot') + '/libs/dx/js/localization/dx.messages.ru.js', () => {

		DevExpress.localization.locale ('ru')
		
		DevExpress.config ({
		    oDataFilterToLower: false,
		})

	})

    clearTimeout (window.alarm)
    
    $(window).keydown (check_hotkeys)

    if (!$_USER) return show_block ('login')

    let [type, id] = location.pathname.split ('/').filter ((i) => i)

    if (!type) return redirect (window.name = '/users')

    $_REQUEST = {type, id}

    show_block ('main')

})()