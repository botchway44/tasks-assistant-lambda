import { ConfirmationState, State } from "./dto";
import { createCloseResponseDTO, CreateNewTask, INTENTS } from "./utils"
import { MongoClientConnection } from "./utils/"

// init a new MongoClient
let mongoClient: MongoClientConnection;

// Works for the V2 version of the Lex SDK client
// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes: any, slots: any, intentName: string, confirmationState: ConfirmationState, fulfillmentState: State, message: string) {
    return createCloseResponseDTO(sessionAttributes, slots, intentName, fulfillmentState, confirmationState, message);
}


function delegate(session_attributes: any, slots: any) {
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    };

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
    // var moviename = slots.name;
    // var whatInfo = slots.summary;
    console.log(`Session sessionAttributes = ${sessionAttributes}`);

    callback(
        close(
            sessionAttributes,
            slots,
            intentName,
            'Confirmed',
            'Fulfilled',
            `Here are all your tasks list`
        ));

}

/**
 * Handles create Task intent
 * @param intentRequest 
 * @param callback 
 */
async function handleAddTasksIntent(intentRequest: any, callback: any) {

    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;

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
                    message
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
                    `I had trouble adding to your task list`
                ));
        }
    );


}


// --------------- Events -----------------------
async function dispatch(intentRequest: any, callback: any) {
    // console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}`);
    // console.log(` ${JSON.stringify(intentRequest)}`);

    // console.log("Request received");
    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;
    // var moviename = slots.name;
    // var whatInfo = slots.summary;

    if (intentName === INTENTS.ADDTASKS) await handleAddTasksIntent(intentRequest, callback);
    else if (intentName === INTENTS.ALLTASKS) await handleAllTasksIntent(intentRequest, callback);

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
                callback(null, response);
            });
    } catch (err: any) {
        callback(err);
    }
};

