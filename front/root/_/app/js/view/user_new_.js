$_DRAW.user_new_ = async function (data) {

    (await to_fill ('user_new_', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'users_new_form',

            record: {},

            field_options : {                
                id_role: {voc: data.roles},
            },

        })
    
    })

}
