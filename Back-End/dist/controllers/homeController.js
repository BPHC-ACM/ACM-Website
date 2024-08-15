"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHome = void 0;
const getHome = (req, res) => {
    res.json({ message: 'Welcome to the Home Page!' });
};
exports.getHome = getHome;
