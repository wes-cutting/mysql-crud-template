const TableCrud = require('./mysql-crud')
const dotenv = require('dotenv')
dotenv.config()

const sampleContext = {
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    table: process.env.TABLE
}

const main = async () => {
    try{
        const example = new TableCrud(sampleContext, {})
        const testConnectResult = await example.testConnection() ? 
            'Test Connection Succeeded' :
            'Test Connection Failed'
        console.log(testConnectResult)
        
        const testCount = await example.count()
        console.log('Table Count', testCount)
        console.log('typeof', typeof testCount)

        const testAll = await example.findAll()
        console.log('Find All', testAll)
        console.log('typeof', typeof testestAlltCount)

        const testRange = await example.findRange(1, 100)
        console.log('Find Range ', testRange)
        console.log('typeof', typeof testRange)



        const testConnectResult2 = await example.testConnection() ? 
            'Test Connection 2 Succeeded' :
            'Test Connection 2 ailed'
        console.log(testConnectResult2)
    } catch(err){
        console.log('-- Main Catch --')
        if(err.msg){
            console.log(err.msg)
        }else if(err.sqlMessage){
            console.log('----', err.code,'----', err.sqlMessage)
        }else {
            console.log(err)
        }
    }
}

main()