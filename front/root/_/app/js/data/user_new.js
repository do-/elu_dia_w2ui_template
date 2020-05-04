////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_new = async function (e) {

    let f = w2_popup_form ()

    let data = f.values ().actual ().validated ()
        
    f.lock ()

    let item = await response ({type: 'users', action: 'create', id: new_uuid ()}, {data})

    open_tab ('/user/' + item.uuid)
    
    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_new = async function (o) {

    return $('body').data ('data')
    
}