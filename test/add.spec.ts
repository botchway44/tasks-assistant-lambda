import { CreateNewTask, MongoClientConnection } from "../src/utils";
let mongoClient: MongoClientConnection;


async function connect() {

    mongoClient = new MongoClientConnection();
    await mongoClient.connect().then(() => console.log("conected"));
}

function main() {

    connect();

    const new_task = CreateNewTask("Test", "This is a test ", new Date().toString(), new Date().getTime().toString());
    mongoClient.addTask(new_task);
}


main();