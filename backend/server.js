// Express
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// create an instance of express
const app = express();
app.use(express.json())
app.use(cors())
mongoose.connect('mongodb://localhost:27017/mern-app')
    .then(() => {
        console.log("connected")
    })
    .catch((err) => {
        console.log(err)
    })
// let todos = [];
// Define rout
// app.get('/',(req,res)=>{ 
//  res.send("Send it")
// })
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
})
const todoModel = mongoose.model('Todo', todoSchema)
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id:todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try {
        let newTodo = new todoModel({ title, description })
        await newTodo.save()
        res.status(201).json(newTodo)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})
// get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.json(todos)
})
//update toto iteam
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        if (!updatedTodo) {
            return res.status(404).json({ message: "todo not found" })

        }
        res.json(updatedTodo)
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})

// delete
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id)
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})

app.listen(8000, () => {
    console.log("server start")
}) 