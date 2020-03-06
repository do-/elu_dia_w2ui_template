const Dia = require ('../../Ext/Dia/Dia.js')
const Session = require ('./HTTP/Session.js')
const DiaW2uiFilter = require ('../../Ext/Dia/Content/Handler/HTTP/Ext/w2ui/Filter.js')

module.exports = class extends Dia.HTTP.Handler {

    check () {

        super.check ()

        let m = this.http.request.method

        switch (m) {
        	case 'GET':
        	case 'POST':
        		break
        	default:
        		throw '405 No ' + m + 's please'
        }

    }

    get_session () {

    	let h = this
    	let p = h.pools

    	return new Session (h, {
    		sessions:    p.sessions,
    		cookie_name: h.conf.auth.sessions.cookie_name || 'sid',
    	})

    }
    
    async read_params () {
    
    	this.http.request.url = this.http.request.url
    		.replace (/\?/g, '&')
    		.replace (/\/\&/g, '?')
    		// DHX blindly appends '?': /_back/?type=users?from=0&limit=50&responseType=text
        
        return super.read_params ()

    }    

    is_anonymous () {
    	return true // DHX sends no cookies
//        return this.rq.type == 'sessions' && this.rq.action == 'create'
    }

    get_method_name () {
        let rq = this.rq
        if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
        if (rq.action) return 'do_'  + rq.action + '_' + rq.type
        return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }
    
    w2ui_filter () {return new DiaW2uiFilter (this.rq)}

}