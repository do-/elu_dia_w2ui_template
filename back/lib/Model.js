const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.DB.Model {

    constructor (conf) {
		
		let root = '../../slices', paths = [
			'./Model/', 
			...fs.readdirSync (root).map (i => `${root}/${i}/back/lib/Model`)
		]

        super ({conf, paths})
        
	}

    trg_check_column_values (tab) {
    	let sql = ''
    	for (let name in tab.columns) sql += this.trg_check_column_value (tab, name)
    	return sql
    }
    
    trg_check_column_value (tab, name) {
    
    	let col = tab.columns [name]
    	let sql = ''

    	let re = col.PATTERN; if (re) sql += `
			IF NEW.${name} IS NOT NULL AND NEW.${name} !~ '${re}' THEN
				RAISE '#${name}#: Проверьте, пожалуйста, правильность заполнения поля "${col.REMARK}"';
			END IF;
    	`

    	return sql

    }

    on_before_parse_table_columns (table) {
    
    	if (!table.pk) {
    	
			let {columns} = table

			if (columns.id) {
				table.pk = 'id'
			}
			else {
				columns [table.pk = 'uuid'] = 'uuid'
			}

    	}    
        
    }

}