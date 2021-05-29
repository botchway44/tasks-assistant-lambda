"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionState = void 0;
class SessionState {
    constructor(sessionAttributes, dialogAction, intent, activeContexts) {
        this.sessionAttributes = sessionAttributes;
        this.dialogAction = dialogAction;
        this.intent = intent;
        this.activeContexts = activeContexts;
    }
}
exports.SessionState = SessionState;
