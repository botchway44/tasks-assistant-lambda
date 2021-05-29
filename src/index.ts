// 'use strict';

import { INTENTS } from "./constants";
import { ConfirmationState, State } from "./dto";
import { createCloseResponseDTO } from "./utils/response-utils"




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



// --------------- Events -----------------------
function dispatch(intentRequest: any, callback: any) {
    // console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}`);
    // console.log(`request received for ${JSON.stringify(intentRequest)}`);

    console.log("Request received");
    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;
    // var moviename = slots.name;
    // var whatInfo = slots.summary;
    // console.log(`request received for Slots=${moviename}, ${whatInfo}`);


    if (intentName === INTENTS.MAKEAPPOINTMENT) {
        callback(
            close(
                sessionAttributes,
                slots,
                intentName,
                'Confirmed',
                'Fulfilled',
                `Thanks for using this service`
            ));
    }


}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
export const handler = (event: any, context: any, callback: any) => {
    try {
        dispatch(event,
            (response: any) => {
                callback(null, response);
            });
    } catch (err: any) {
        callback(err);
    }
};

