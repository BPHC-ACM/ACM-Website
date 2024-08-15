"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbout = void 0;
const getAbout = (req, res) => {
    res.json({ message: 'This is the About Page. Learn more about us here.' });
};
exports.getAbout = getAbout;
