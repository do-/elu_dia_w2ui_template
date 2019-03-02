define ([], function () {
    
    return function (data, view) {
    
        $('title').text ('Пользователи системы')
/*
        $('main').w2regrid ({ 
        
            name: 'usersGrid',             
            
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
            },            

            columns: [                
                {field: 'label',   caption: 'ФИО',    size: 100, sortable: true},
                {field: 'login',   caption: 'Login',  size: 50,  sortable: true},
                {field: 'id_role', caption: 'Роль',   size: 50,  render: function (i) {return data.roles [i.id_role]}},
                {field: 'mail',    caption: 'E-mail', size: 50,  sortable: true},
            ],
                        
            url: '_back/?type=users',

            onAdd: function (e) {use.block ('users_new')},

        }).refresh ();
        
        $('#grid_usersGrid_search_all').focus ()
*/
    }

})