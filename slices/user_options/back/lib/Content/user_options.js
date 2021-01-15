module.exports = {

////////////////////////////////////////////////////////////////////////////////

select_user_options: 

    async function () {

    	let {db, rq, user} = this, {id_user} = rq

		if (!id_user) throw '#id_user#:Некорректный запрос'

        if (user.role != 'admin' && id_user != user.id) throw '#foo#:Доступ запрещён'

        let u = await db.get ([{users: id_user}, 'roles'])

        let filter = {'roles... LIKE': `% ${u['roles.name']} %`}

        return db.add ({}, [

            {voc_user_options: filter},

            {'user_options(is_on)': {id_user}}

        ])

    },

////////////////////////////////////////////////////////////////////////////////

do_update_user_options: 

    async function () {

    	let {db, rq, user} = this, {data} = rq, {id_voc_user_option} = data
    	
		if (!data.id_user) throw '#id_user#:Некорректный запрос'

        if (user.role != 'admin') {

        	if (data.id_user != user.id) throw '#foo#:Доступ запрещён'

//			let voc_user_option = await db.get ({voc_user_options: id_voc_user_option})

			let voc_user_option = db.model.tables.voc_user_options.data.find (i => i.id = id_voc_user_option)

        	if (!voc_user_option.is_own) throw '#foo#:Доступ запрещён'

        }

        return this.db.upsert ('user_options', data, ['id_user', 'id_voc_user_option'])

    },

}