////////////////////////////////////////////////////////////////////////////////

$_DO.create_users_ = async function (o) {

	show_block ('user_new_')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.users_ = async function (o) {

	let [list, vocs] = await Promise.all ([
    	response ({type: 'users', part: 'vocs'}),    
    	response ({type: 'users'}, {offset: 0, limit: 100}),	
	])
	
	let data = {...list, ...vocs}

    add_vocabularies (data, {roles: 1})
    
    $('body').data ('data', data)
            
    return data

}