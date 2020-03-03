const assert = require('assert');
const TableCrud = require('../mysql-crud')
const dotenv = require('dotenv')
dotenv.config()

const contextConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  table: process.env.TABLE
}

describe('CRUD Simple Checks', function() {
  let context;
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
  before(function(){
    context = new TableCrud(contextConfig, schema, false)
  })
  after(function(){
    context.endConnectionPool({cleanup: true }, "CRUD-SC After")
  })
  describe('Test Connection', function() {
    it('validates that Context Config connects to database', async function() {
      const testConnectResult = await context.testConnection() ? 
            'Test Connection Succeeded' :
            'Test Connection Failed'
      assert.equal(testConnectResult, "Test Connection Succeeded")
    });
  });
});