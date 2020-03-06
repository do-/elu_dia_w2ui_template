$_DRAW.main = async function (data) {

    let $main = $('body').html ('<main id=main />')
    
    show_block ($_REQUEST.type)
    show_block ('nav')
    
    return $main

}