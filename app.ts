import { CreateNewTask, MongoClientConnection } from "./src/utils";

const express = require("express");

const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

let mongoClient: MongoClientConnection;

//account type
app.get("/add", async (req: any, res: any) => {
    const new_task = CreateNewTask("Test", new Date().toString(), new Date().getTime().toString());
    await mongoClient.addTask(new_task)

    res.status("200").json(new_task);
});

//account type
app.get("/all", async (req: any, res: any) => {
    const tasks = await mongoClient.getAllTasks();
    res.status("200").json(tasks);
});


//index route
app.post("/transaction", (req: any, res: any) => {
    const body = req.body;
    res.status("200").json({});
});



app.listen(PORT, async () => {
    mongoClient = new MongoClientConnection();

    mongoClient.connect().then(() => {
        console.log("the app is running ");
    })
});
