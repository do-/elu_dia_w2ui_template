$_DRAW.user = async function (data) {

    let __read_only = 1
    
    $_F5 = () => {
    
            $('.toolbar button').each (function () {
                let $this = $(this)
                let is_ro = $this.is ('[data-edit]') ? 0 : 1
                $this.css ({display: is_ro == __read_only ? 'inline-block' : 'none'})
            })
            
    }

    $('title').text (data.label)
    
    let $main = $('main').html ((await use.jq ('user')).draw_form (data))
    
    show_block ('user_options')

    return $main
    
}