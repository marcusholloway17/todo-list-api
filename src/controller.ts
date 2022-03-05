import fs from "fs"
import path from "path"
import { ServerResponse, IncomingMessage } from "http"
import { Task } from "./ITask"

// Get tasks
export const getTasks = (req: IncomingMessage, res: ServerResponse) => {
    return fs.readFile(
        path.join(__dirname, "store.json"),
        "utf8",
        (err, data) => {
            if(err){
                res.writeHead(500, {"content-type": "application/json"})
                res.end(
                    JSON.stringify({
                        success: false,
                        error: err
                    })
                )
            }else{
                res.writeHead(200, {"content-type": "application/json"})
                res.end(
                    JSON.stringify({
                        success: true,
                        data: JSON.parse(data)
                    })
                )
            }
        }
    )
}

// Add task
export const addTask = (req: IncomingMessage, res: ServerResponse) => {
    // Read the data from the request
    let data = ""

    req.on("data", (chunk) => {
        data += chunk.toString()
    })

    // When the request is done
    req.on("end", () => {
        let task = JSON.parse(data)

        // Read the store.json file
        fs.readFile(path.join(__dirname, "store.json"), "utf8", (err, data) => {
            // Check out any error
            if(err){
                // error; send an error message
                res.writeHead(500, {"content-type": "application/json"})
                res.end(
                    JSON.stringify({
                        success: false,
                        error: err
                    })
                )
            }else{
                // no error, get the current tasks
                let tasks: [Task] = JSON.parse(data)
                // get the id of the latest task
                let latest_id = tasks.reduce(
                    (max = 0, task: Task) => (task.id > max ? task.id : max),
                    0
                )
                // Increment the id by 1
                task.id = latest_id + 1
                // Add the new task to the tasks array
                tasks.push(task)

                // Write the new tasks array to the store.json file
                fs.writeFile(
                    path.join(__dirname, "store.json"),
                    JSON.stringify(tasks),
                    (err) => {
                        // check out any error
                        if(err){
                            // error, send an error message
                            res.writeHead(500,  {"content-type": "application/json"})
                            res.end(
                                JSON.stringify({
                                    success: false,
                                    error: err
                                })
                            )
                        }else{
                            res.writeHead(200, {"content-type": "application/json"})
                            res.end(
                                JSON.stringify({
                                    success: true,
                                    message: task
                                })
                            )
                        }
                    }
                )
            }
        })
    })

}

// Update a task
export const updateTask = (req: IncomingMessage, res: ServerResponse) => {
    // Read the data from the request
    let data = ""
    req.on("data", (chunk) => {
        data += chunk.toString()
    })

    // When the request is done 
    req.on("end", () => {
        // Parse the data
        let task: Task = JSON.parse(data)
        // Read the store.json file
        fs.readFile(path.join(__dirname, "store.json"), "utf8", (err, data) => {
            // Check out any error
            if(err){
                res.writeHead(500, {"content-type": "application/json"})
                res.end(
                    JSON.stringify({
                        success: false,
                        error: err
                    })
                )
            }else{
                // No error, get the current tasks
                let tasks: [Task] = JSON.parse(data)
                // Find the task with the id
                let index = tasks.findIndex((t) => t.id == task.id)
                // Replace the task with the new one
                tasks[index] = task
                // Write the new task to the store.json file
                fs.writeFile(
                    path.join(__dirname, "store.json"),
                    JSON.stringify(tasks),
                    (err) => {
                        // Check out any error
                        if(err){
                            res.writeHead(500, {"content-type": "application/json"})
                            res.end(
                                JSON.stringify({
                                    success: false,
                                    error: err
                                })
                            )
                        }else{
                            res.writeHead(200, {"content-type": "application/json"})
                            res.end(
                                JSON.stringify({
                                    success: true,
                                    message: task
                                })
                            )
                        }
                    })
            }
        })
        
    })

}


// Delete a task
export const deleteTask = (req: IncomingMessage, res: ServerResponse) => {
    // Read the data from the request
    let data = ""
    req.on("data", (chunk) => {
        data += chunk.toString()
    })
    // When the request is done
    req.on("end", () => {
        // parse the data
        let task: Task = JSON.parse(data)
        //read the store.json file
        fs.readFile(path.join(__dirname, "store.json"), "utf8", (err, data) => {
            // Check out any error
            if(err){
                res.writeHead(500, {"content-type": "application/json"})
                res.end(
                    JSON.stringify({
                        sucess: false,
                        error: err
                    })
                )
            }else{
                // No error, get thee current task
                let tasks: [Task] = JSON.parse(data)
                // Find the task with the id
                let index = tasks.findIndex((t) => t.id == task.id)
                // Remove the task
                tasks.splice(index, 1)
                // write the new tasks array to the store.json file
                fs.writeFile(
                    path.join(__dirname, "store.json"),
                    JSON.stringify(tasks),
                    (err) => {
                        if(err){
                            res.writeHead(500, {"content-type": "application/json"})
                            res.end(
                                JSON.stringify({
                                    success: false,
                                    error: err
                                })   
                            )
                        }else{
                            res.writeHead(200, {"content-type": "application/json"})
                            res.end(
                                JSON.stringify({
                                    success: true,
                                    error: task
                                })   
                            )
                        }
                    }
                )
            }
        })
    })
}

