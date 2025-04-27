"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class BaseRouter {
    router = (0, express_1.Router)();
    constructor(controller) {
        this.initialize(controller);
    }
}
exports.default = BaseRouter;
