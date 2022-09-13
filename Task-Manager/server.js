const connectDB = require('./database/connectMongoDB');
// const connect = require('./database/connectMySql');
const express = require('express');
const tasks = require('./routes/tasks');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const app = express();
const port = process.env.PORT;
const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log("Server running on http://localhost:"+port));
    }catch(error){
        console.log(error);
    }
}

start();
//middleware
app.use(express.static('./public'));
app.use(express.json());

//routes
app.use('/api/v1/tasks', tasks);
app.use(notFound);
app.use(errorHandler);
// app.get('/api/v1/task') = get all the tasks
// app.post('/api/v1/task') = create a new task
// app.get('/api/v1/task/:id') = get single task
// app.patch('/api/v1/tasks/:id') = update task
// app.delete('/api/v1/tasks/:id') = delete task
