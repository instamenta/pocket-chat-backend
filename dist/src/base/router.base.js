"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vanilla_utility_pack_1 = require("@instamenta/vanilla-utility-pack");
const express_1 = require("express");
class BaseRouter {
    router = (0, express_1.Router)();
    constructor(controller) {
        this.initialize(controller);
    }
    initialize(c) {
        throw new vanilla_utility_pack_1.NotImplementedError(`Implement "${this.constructor.name}.initialize()"`);
    }
    getRouter() {
        return this.router;
    }
}
exports.default = BaseRouter;
