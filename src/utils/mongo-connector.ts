import { ITask } from "src/dto";

const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
require("dotenv").config();

export class MongoClientConnection {
    public tasks_db_name = 'tasks';
    tasks_collection: any = null;
    mongo_url = process.env.MONGODB_URL;

    db_name = 'LexVoiceApp';

    connect() {

        console.log(this.mongo_url)
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongo_url, { useNewUrlParser: true }, async (
                err: any,
                client: any
            ) => {
                // throw error
                if (err) { reject(err); throw err; };

                // log connected
                console.log('connected to database');
                this.tasks_collection = await client.db(this.db_name).collection(this.tasks_db_name);

                resolve(true)
            });
        });



    }

    async addTask(task: ITask) {
        return await this.tasks_collection.insertOne(task);

    }
    getAllTasks() {
        return this.tasks_collection.find().toArray();
    }

    getTask(id: string) {
        return this.tasks_collection.findOne({ _id: ObjectID(id) });
    }


    removeTask(id: string) {

    }



}