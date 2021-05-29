"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCloseResponseDTO = exports.createDialogAction = exports.createIntent = exports.createMessage = void 0;
const dto_1 = require("../dto");
exports.createMessage = (message, type) => new dto_1.Message(message, type);
exports.createIntent = (name, confirmationState, slots, state) => new dto_1.CreateIntent(name, confirmationState, slots, state);
exports.createDialogAction = (type) => new dto_1.DialogAction(type);
exports.createCloseResponseDTO = (sessionAttributes, slots, intentName, state, confirmationState, message) => new dto_1.CloseResquestResponse(new dto_1.SessionState(sessionAttributes, exports.createDialogAction("Close"), exports.createIntent(intentName, confirmationState, slots, state)), new dto_1.MessageBuilder(new dto_1.Message(message)).allMessages());
