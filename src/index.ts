import { ConfirmationState, ITask, State } from "./dto";
import { createCloseResponseDTO, CreateNewTask, filter, INTENTS } from "./utils"
import { MongoClientConnection } from "./utils/"


/**
 * Works for the V2 version of the Lex SDK client
 */

// init a new MongoClient
let mongoClient: MongoClientConnection;

/**
 * Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled and the attached set of messages
 * @param sessionAttributes
 * @param slots 
 * @param intentName 
 * @param confirmationState 
 * @param fulfillmentState 
 * @param message 
 * @returns 
 */
function close(sessionAttributes: any, slots: any, intentName: string, confirmationState: ConfirmationState, fulfillmentState: State, message: string[]) {
    return createCloseResponseDTO(sessionAttributes, slots, intentName, fulfillmentState, confirmationState, message);
}



function delegate(intent_name : any,session_attributes: any, slots: any) {
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitIntent',
            // 'slots': slots
            'intentName':"AddaskIntent"
        },
        intent: {
            'name': intent_name,
            'confirmationState': 'Confirmed',
            'state' : "Fulfilled"
        }
    };

}


/**
 * 
 * @param  tasks - All users task
 * @returns a string list of messages
 */
function buidTasksList(tasks: ITask[]): string[] {

    const messages = [
        'Here are your tasks'
    ];


    for (const task of tasks) {
        const message = `${task.name} is due ${task.due} at ${task.time} `;
        messages.push(message)
    }

    messages.push('You can also ask for completed tasks')
    return messages;
}

/**
 * Handles all tasks intent which returns all tasks to users
 * @param intentRequest 
 * @param callback 
 */
async function handleAllTasksIntent(intentRequest: any, callback: any) {
    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;

    // console.log(`Session sessionAttributes = ${sessionAttributes}`);

    // const tasks: ITask[] = await mongoClient.getAllTasks();

    // if (tasks && tasks.length > 0) {
    //     const messages = buidTasksList(tasks);
    //     callback(
    //         close(
    //             sessionAttributes,
    //             slots,
    //             intentName,
    //             'Confirmed',
    //             'Fulfilled',
    //             messages
    //         ));
    // } else {
    //     callback(
    //         close(
    //             sessionAttributes,
    //             slots,
    //             intentName,
    //             'Confirmed',
    //             'Fulfilled',
    //             ['You currently have no tasks', 'Give me a task to add to the list']
    //         ));
    // }


    return delegate(intentName, sessionAttributes, slots);

}

/**
 * Handles creating Task intent
 * @param intentRequest 
 * @param callback 
 */
async function handleAddTasksIntent(intentRequest: any, callback: any) {

    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;

    // obtain slots
    const { CompleteByDate, Time, Name } = intentRequest.sessionState.intent.slots;
    const name = Name.value.interpretedValue;
    const due = CompleteByDate.value.interpretedValue;
    const time = Time.value.interpretedValue;
    // 
    // Create a task list and insert asynchronously
    const new_task = CreateNewTask(name, due, time);

    // Add task to mongo Client
    await mongoClient.addTask(new_task).then(
        () => {
            const message = `Task ${Name.value.originalValue} has been added to your task list.`;

            // callback to fullfill the intent list
            callback(
                close(
                    sessionAttributes,
                    slots,
                    intentName,
                    'Confirmed',
                    'Fulfilled',
                    [message]
                ));
        },
        (err) => {

            callback(
                close(
                    sessionAttributes,
                    slots,
                    intentName,
                    'Confirmed',
                    'Fulfilled',
                    [`I had trouble adding to your task list`]
                ));
        }
    );


}


async function handleRemoveAllTasksIntent(intentRequest: any, callback: any) {
    const sessionAttributes = {};
    const slots = {};
    const intentName = intentRequest.interpretations[0].intent.name;

    await mongoClient.removeAllTasks().then(
        (response) => {
            callback(
                close(
                    sessionAttributes,
                    slots,
                    intentName,
                    'Confirmed',
                    'Fulfilled',
                    [`I have cleared your task list.`]
                ));
        },
        (err) => {
            callback(
                close(
                    sessionAttributes,
                    slots,
                    intentName,
                    'Confirmed',
                    'Fulfilled',
                    [`I had trouble clearing task list`]
                ));
        }
    );



}


/**
 *  Handles Completing a Specified Task
 * @param intentRequest 
 * @param callback 
 */
async function handleCompleteTaskIntent(intentRequest: any, callback: any) {
    // log request to know exactly what it contains

    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;

    const { Name } = intentRequest.sessionState.intent.slots;
    const name = Name.value.interpretedValue;

    // get all tasks and filter for the tasks with the name on it
    const tasks: ITask[] = await mongoClient.getAllTasks();
    const filteredTasks: ITask[] = filter(name, tasks);

    // if task is > 0, send a message to ask of which task to complete


    // else ask user to verify if thats the task to complete
}


// --------------- Events -----------------------
async function dispatch(intentRequest: any, callback: any) {
    // console.log(` ${JSON.stringify(intentRequest)}`);

    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;

    if (intentName === INTENTS.ADDTASKS) await handleAddTasksIntent(intentRequest, callback);
    else if (intentName === INTENTS.ALLTASKS) await handleAllTasksIntent(intentRequest, callback);
    else if (intentName === INTENTS.COMPLETETASK) await handleCompleteTaskIntent(intentRequest, callback);
    else if (intentName === INTENTS.REMOVEALLTASKS) await handleRemoveAllTasksIntent(intentRequest, callback);

}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
export const handler = async (event: any, context: any, callback: any) => {

    mongoClient = new MongoClientConnection();

    await mongoClient.connect()

    try {
        await dispatch(event,
            (response: any) => {
                console.log(`Dispatch Response is ${JSON.stringify(response)}`);

                callback(null, response);

                console.log(`CALLBACK Response is ${JSON.stringify(response)}`);
            });
    } catch (err: any) {
        callback(err);
    }
};

