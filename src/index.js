const express = require('express')
const app = express()
const PORT = 3000
const itemRoutes = require('./routes/itemsRoutes.js')

const dbType = process.env.DB_TYPE || 'sqlite'
console.log(dbType)
const Database = dbType === 'sqlite' ? require('./database/sqlite.js') : require('./database/mysql.js')
const db = new Database()

app.use(express.json())
app.use(express.static(__dirname + '/static'));

db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
    const itemsRouter = itemRoutes(db)
    app.use('/api', itemsRouter)
}).catch(err => {
  console.error('Failed to initialize the database:', err);
  process.exit(1);
});

module.exports = app;
module.exports = db;