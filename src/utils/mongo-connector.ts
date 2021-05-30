const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const keys = require('../config/keys');

export class MongoClientConnection {
    public tasks_db_name = 'tasks';
    tasks_collection: any = null;
    mongo_url = keys.db;

    db_name = 'heroku_66680pp0';

    connect() {
        MongoClient.connect(this.mongo_url, { useNewUrlParser: true }, async (
            err: any,
            client: any
        ) => {
            if (err) throw err;
            console.log('connected to database');
            this.tasks_collection = await client.db(this.db_name).collection(this.tasks_db_name);
        });
    }

    async addTask(task: any) {
        return await this.tasks_collection.insertOne(task);

    }
    getAllTasks() {
        return this.tasks_collection.find().toArray();
    }

    getTask(id: string) {
        return this.tasks_collection.findOne({ _id: ObjectID(id) });
    }

}