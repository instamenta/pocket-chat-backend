"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class StoryRouter extends router_base_1.default {
    initialize(c) {
        this.router.get('/', middlewares_1.isAuthorized, c.listStories.bind(c));
        this.router.post('/', middlewares_1.isAuthorized, c.createStory.bind(c));
        this.router.get('/feed', middlewares_1.isAuthorized, c.listFeedStories.bind(c));
        this.router.get('/:username', middlewares_1.isAuthorized, c.listFriendStoriesByUsername.bind(c));
        //* Likes
        this.router.put('/:id/like', middlewares_1.isAuthorized, c.likeStory.bind(c));
        //* Comments
        this.router.get('/comments/:shortId', middlewares_1.isAuthorized, c.listCommentsByStory.bind(c));
        this.router.post('/comments/:shortId', middlewares_1.isAuthorized, c.createStoryComment.bind(c));
        this.router.delete('/comments/:commentId', middlewares_1.isAuthorized, c.deleteStoryComment.bind(c));
        this.router.put('/comments/:commentId', middlewares_1.isAuthorized, c.likeStoryComment.bind(c));
    }
}
exports.default = StoryRouter;
