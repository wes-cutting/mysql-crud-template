const mysql = require('mysql')

class MySQLTableCRUD {
    /**
     * @description Preconfigures an instance of this class with the dynamic values needed for basic CRUD
     * @param {object} dbCxt Specify Database Context information for MySQL
     * @param {object} schema Provide a model to validate records 
     * @summary Example of dbCxt: 
     *          {
     *              host: @type {STRING},
     *              user: @type {STRING},
     *              password: @type {STRING},
     *              database: @type {STRING}, 
     *              table: @type {STRING}
     *          }
     *          Example of schema (array of column criteria objects): 
     *          [
     *              {
     *                  name: @type {STRING},
     *                  type: @type {STRING},
     *                  required: @type {BOOLEAN},
     *                  rules: [
     *                      {
     *                          type: @type {STRING},
     *                          data: @type {NUMBER}
     *                      },
     *                      ...
     *                  ]
     *              },
     *              ...
     *          ]
     */
    constructor(dbCxt, schema, debug){
        try{
            this.validateConstructor(dbCxt, schema)
            const {table, ...context} = dbCxt
            this.table = table
            this.schema = schema
            this.debug = debug

            this.pool = mysql.createPool({
                connectionLimit: 20,
                ...context
            })
            this.pool.on('release', (connection) => {

                this.print(`DAL----Connection ${connection.threadId} released` );
              });
        }catch(err){
            throw err
        } 

        process.on('exit', this.endConnectionPool.bind(null,{cleanup:true}))
        process.on('SIGINT', this.endConnectionPool.bind(null, {exit:true}))
        process.on('SIGUSR1', this.endConnectionPool.bind(null, {exit:true}))
        process.on('SIGUSR2', this.endConnectionPool.bind(null, {exit:true}))
        process.on('uncaughtException', this.endConnectionPool.bind(null, {exit:true}))

        this.validateConstructor = this.validateConstructor.bind(this)
        this.testConnection = this.testConnection.bind(this)
    }

    print = (message) => {
        if(this.debug){
            console.log(message)
        }
    }

    validateConstructor(dbCxt, schema){
        if(typeof dbCxt !== 'object'){
            throw 'DAL----dbCxt needs to be an Object'
        }else if(!Array.isArray(schema)){
            throw 'DAL----schema needs to be an Array'
        }

        if(!dbCxt.host || typeof dbCxt.host !== 'string'){
            throw 'DAL----Database Context needs a valid Host'
        }else if(!dbCxt.user || typeof dbCxt.user !== 'string'){
            throw 'DAL----Database Context needs a valid User'
        }else if(!dbCxt.password || typeof dbCxt.password !== 'string'){
            throw 'DAL----Database Context needs a valid Password'
        }else if(!dbCxt.database || typeof dbCxt.database !== 'string'){
            throw 'DAL----Database Context needs a valid Database'
        }else if(!dbCxt.table || typeof dbCxt.table !== 'string'){
            throw 'DAL----Database Context needs a Table'
        }
    }
    
    validateRecord(record, action){
        let propName;
        for(let i = 0; i < this.schema.length; i++){
            propName = this.schema[i].name
            if(this.schema[i].required){
                if(!record[propName]){
                    throw `DAL---- '${propName}' field is Required to ${action}`
                }
            }
            if(record[propName]){
                if(typeof record[propName] !== this.schema[i].type){
                    throw `DAL---- '${propName}' field type does not match Schema`
                }
            }
        }
    }

    testConnection(){
        const table = this.table
        const result = new Promise((resolve, reject) => {
            this.print(`DAL ${table}----Testing Connection`)
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(connection._socket.readable)
                    this.print(`DAL ${table}----Releasing Test Connection`)
                    connection.release()
                }
            })
        })
        return result
    }

    endConnectionPool = (options, exitCode) => {
        this.print('Options:', options, ', ExitCode:', exitCode)
        if (options.cleanup) {
            this.print(`DAL----Ending Pool for ${this.table}`)
            this.pool.end(()=>this.print(`DAL----Ended Pool for ${this.table}`))
        }
        if (exitCode || exitCode === 0) this.print(exitCode);
        if (options.exit) process.exit();
    }

    count(){
        const table = this.table
        const result = new Promise((resolve, reject) => {
            this.print(`DAL ${table}----Connection for Count`)
            this.pool.getConnection(async function(err, connection){
                if (err) {
                    reject(err)
                }
                else {
                    connection.query(`SELECT COUNT(*) as count FROM \`${table}\``, 
                        function(err, results, fields){
                            if(err) {
                                reject(err)
                            } 
                            else {
                                resolve(results[0].count)
                            }
                        })
                    this.print(`DAL ${table}----Releasing Connection for Count`)
                    connection.release()
                }
            })
        })
        return result
    }

    find(filter){

    }

    findRange(start, count){
        if(typeof start !== 'number' || typeof count !== 'number'){
            throw 'Find Range needs Numerical Inputs'
        }
        const table = this.table
        const result = new Promise((resolve, reject) => {
            this.print(`DAL ${table}----Connection for Find Range`)
            this.pool.getConnection(async function(err, connection){
                if (err) {
                    reject(err)
                }
                else {
                    connection.query(`SELECT * FROM \`${table}\` LIMIT ${start}, ${count}`, 
                        function(err, results, fields){
                            if(err) {
                                reject(err)
                            } 
                            else {
                                resolve(results)
                            }
                        })
                    this.print(`DAL ${table}----Releasing Connection for Find Range`)
                    connection.release()
                }
            })
        })
        return result
    }

    findAll(){
        const table = this.table
        const result = new Promise((resolve, reject) => {
            this.print(`DAL ${table}----Connection for Find All`)
            this.pool.getConnection(async function(err, connection){
                if (err) {
                    reject(err)
                }
                else {
                    connection.query(`SELECT * FROM \`${table}\``, 
                        function(err, results, fields){
                            if(err) {
                                reject(err)
                            } 
                            else {
                                resolve(results)
                            }
                        })
                    this.print(`DAL ${table}----Releasing Connection for Find All`)
                    connection.release()
                }
            })
        })
        return result
    }

    createOne(record){
        this.validateRecord(record, 'Create One')
        return 'Success'
    }

    createMany(records){

    }

    updateOne(id, record){

    }

    deleteOne(id){

    }

    deleteMany(filter){

    }
}

module.exports = MySQLTableCRUD