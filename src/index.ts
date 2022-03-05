import http from "http"
import { getTasks, addTask, updateTask, deleteTask } from "./controller"

const myServer = http.createServer((req, res) => {
    // Get Tasks
    if(req.method=="GET" && req.url =="/api/tasks"){
        return getTasks(req, res)
    }

    // Creating a task
    if(req.method=="POST" && req.url =="/api/tasks"){
        return addTask(req, res)
    }

    // Updating a task
    if(req.method=="PUT" && req.url =="/api/tasks"){
        return updateTask(req, res)
    }

    // Deleting a task
    if(req.method=="DELETE" && req.url =="/api/tasks"){
        return deleteTask(req, res)
    }
})


myServer.listen(3000, () => {
    console.log('Server is running on port 3000. Go to http://localhost:3000/')
})

// myServer.close()