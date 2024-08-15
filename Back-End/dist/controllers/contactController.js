"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = exports.getContact = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const getContact = (req, res) => {
    res.json({ message: 'Contact us through this page.' });
};
exports.getContact = getContact;
const postMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new messageModel_1.default({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message received!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
exports.postMessage = postMessage;
