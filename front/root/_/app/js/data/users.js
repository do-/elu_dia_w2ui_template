define ([], function () {

    $_DO.create_users = function (e) {
        
        use.block ('users_new')

    }

    return function (done) {
    
        query ({type: 'roles'}, {}, function (data) {
        
            add_vocabularies (data, {roles: 1})
            
            $('body').data ('data', data)
            
            done (data)
        
        })                   
        
    }
    
})