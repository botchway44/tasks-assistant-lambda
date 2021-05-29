"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allInvocationSource = ["DialogCodeHook", "FulfillmentCodeHook"];
const allInputMode = ["DTMF", "Speech", "Text"];
const allConfirmationState = ["Confirmed", "Denied", "None"];
const allResponseContentType = ["CustomPayload ", " ImageResponseCard ", " PlainText ", " SSML"];
// export type ResponseContentType = "CustomPayload " | " ImageResponseCard " | " PlainText " | " SSML";
const allDialogActionType = ["Close ", " ConfirmIntent ", " Delegate ", " ElicitIntent ", " ElicitSlot"];
const allStates = ["Failed", "Fulfilled", "InProgress", "ReadyForFulfillment"];
