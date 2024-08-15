"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aboutController_1 = require("../controllers/aboutController");
const router = express_1.default.Router();
router.get('/', aboutController_1.getAbout);
exports.default = router;
