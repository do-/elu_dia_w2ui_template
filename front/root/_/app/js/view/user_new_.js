$_DRAW.user_new_ = async function (data) {
    
    $('.w2ui-form', new elu.Popup (await to_fill ('user_new_', data)).$div).w2reform ({

        name: 'users_new_form',

        record: {},

        field_options : {                
            id_role: {voc: data.roles},
        },

    })

}