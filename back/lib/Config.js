const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.Config {

    constructor () {
    
    	super ('../conf/elud.json')
                
        this.pools = {
        
        	db       : Dia.DB.Pool (this.db, new (require ('./Model.js')) (this)),
        	
            sessions : this.setup_sessions (),
            
			pwd_calc: new (require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')) ({
				salt_file: this.auth.salt_file,
				// algorithm: 'sha256', // <-- default value
				// encoding:  'hex',    // <-- also default; set null to get a Buffer
			}),

        }

    }
    
    setup_sessions () {

    	let {timeout, redis, memcached} = this.auth.sessions, ttl = timeout * 60 * 1000

    	if (redis)		return new (require ('./Ext/Dia/Cache/Redis.js')) 		({ttl, redis})

    	if (memcached)	return new (require ('./Ext/Dia/Cache/Memcached.js'))	({ttl, memcached})

						return new (require ('./Ext/Dia/Cache/MapTimer.js'))	({ttl, name: 'session'})

    }

    async init () {
    
		let db = this.pools.db
		
		await db.load_schema ()
		
		await db.update_model ()

    }

}