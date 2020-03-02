const TableCrud = require('./mysql-crud')
const dotenv = require('dotenv')
dotenv.config()

const sampleContext = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    table: process.env.TABLE
}

const schema = [
    {
        name: "username",
        type: "string",
        required: true,
    },
    {
        name: "email",
        type: "string",
        required: false,
    },
    {
        name: "password",
        type: "string",
        required: false,
    },
    {
        name: "favorite-color",
        type: "string",
        required: false,
    },
]

const main = async () => {
    try{
        const example = new TableCrud(sampleContext, schema)
        const testConnectResult = await example.testConnection() ? 
            'Test Connection Succeeded' :
            'Test Connection Failed'
        console.log(testConnectResult)
        
        const testCount = await example.count()
        console.log('Table Count', testCount)
        console.log('typeof', typeof testCount)

        const testAll = await example.findAll()
        console.log('Find All', testAll)
        console.log('typeof', typeof testAll)

        const testRange = await example.findRange(1, 2)
        console.log('Find Range', testRange)
        console.log('typeof', typeof testRange)

        const testCreateOne = await example.createOne({
            
            email: 'test1.test.test'
        })
        console.log('Create One', testCreateOne)

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