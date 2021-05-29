"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIntent = void 0;
class CreateIntent {
    constructor(name, confirmationState, slots, state, kendraResponse) {
        this.name = name;
        this.confirmationState = confirmationState;
        this.slots = slots;
        this.state = state;
        this.kendraResponse = kendraResponse;
    }
}
exports.CreateIntent = CreateIntent;
