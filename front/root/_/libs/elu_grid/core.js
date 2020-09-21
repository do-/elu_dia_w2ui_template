var elu; if (!elu) elu = {}; elu = {...{

	z_index: 1,

	css_prefix: 'elu_',
	
	css: (name) => elu.css_prefix + name,

}, ...elu};

async function show_dialog (name, o) {
    
    if (!o) o = {}
    
    console.log ('show_dialog ' + name, o)
    
    if (!(name in $_GET))  await use.js (`data/${name}`)
    if (!(name in $_GET))  return console.log (`$_GET.${name} is not defined!`)
    
    if (!(name in $_DRAW)) await use.js (`view/${name}`)
    if (!(name in $_DRAW)) return console.log (`$_DRAW.${name} is not defined!`)
    
    let data = await $_GET [name] (o)
    
    return new Promise (async (ok, fail) => {

	    let view = await $_DRAW [name] (data, v => {
	    
	    	view.remove ()
	    	
	    	ok (v)
	    
	    })

		$('*', view).attr ('data-block-name', name)

		view.setup_buttons ()

		recalc_rubber_panels ()
		
		let t = setInterval (() => {
		
			if (view.length) return
			
			clearInterval (t)
			
			ok (null)
		
		}, 100)

    })

}