"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilder = exports.Message = void 0;
class Message {
    constructor(content, contentType) {
        this.content = content;
        this.contentType = contentType;
        if (!this.contentType) {
            this.contentType = "PlainText";
        }
    }
}
exports.Message = Message;
class MessageBuilder {
    // Todo Fix to take multiple messages and push
    constructor(message) {
        this.messages = [];
        this.messages.push(message);
    }
    add(message) {
        this.messages.push(message);
    }
    allMessages() {
        return this.messages;
    }
}
exports.MessageBuilder = MessageBuilder;
