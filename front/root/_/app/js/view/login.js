$_DRAW.login = async function (data) {

    let $body = $('body').html (await use.html ('login')).css ({backgroundImage: 'url(' + staticURL ('libs/elu_dia_w2ui_template/img/The-Good-Times-1.JPG') + ')'})
    
    $('input[name=login]').keypress    (function (e) {if (e.which == 13) $('input[name=password]').focus ()}).focus ()
    $('input[name=password]').keypress (function (e) {if (e.which == 13) $_DO.execute_login ()})
    
    return $body

}