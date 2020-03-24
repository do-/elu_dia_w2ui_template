$_DRAW.user_new_ = async function (data) {

	let $view = await to_fill ('user_new_', data)
        
    $view.draw_popup ()	
    
    $('.w2ui-form', $view).w2reform ({

        name: 'users_new_form',

        record: {},

        field_options : {                
            id_role: {voc: data.roles},
        },

    })

}