"use strict";
// 'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// Works for the V2 version of the Lex SDK client
// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, slots, intentName, fulfillmentState, message) {
    return {
        "sessionState": {
            "sessionAttributes": sessionAttributes,
            "dialogAction": {
                "type": "Close"
            },
            "intent": {
                "confirmationState": "Confirmed",
                "name": intentName,
                "slots": slots,
                "state": fulfillmentState
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": message,
            }
        ],
    };
}
function delegate(session_attributes, slots) {
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    };
}
// --------------- Events -----------------------
function dispatch(intentRequest, callback) {
    // console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}`);
    // console.log(`request received for ${JSON.stringify(intentRequest)}`);
    console.log("Request received");
    const sessionAttributes = intentRequest.sessionState.sessionAttributes || {};
    const slots = intentRequest.interpretations[0].intent.slots || {};
    const intentName = intentRequest.interpretations[0].intent.name;
    // var moviename = slots.name;
    // var whatInfo = slots.summary;
    // console.log(`request received for Slots=${moviename}, ${whatInfo}`);
    callback(close(sessionAttributes, slots, intentName, 'Fulfilled', `Thanks for using this service`));
}
// --------------- Main handler -----------------------
// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event, (response) => {
            callback(null, response);
        });
    }
    catch (err) {
        callback(err);
    }
};
