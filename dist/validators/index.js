"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = exports.createStory = exports.updatePublication = exports.createPublication = exports.url = exports.updateProfilePublicInformation = exports.createNotification = exports.videoCallInvitationRequest = exports.liveMessage = exports.message = exports.createMessage = exports.name = exports.uuid = exports.senderRecipient = exports.loginUser = exports.createUser = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUser = zod_1.default.object({
    firstName: zod_1.default
        .string()
        .min(3, { message: "First name must be at least 3 characters" })
        .max(32, { message: "First name cannot exceed 32 characters" }),
    lastName: zod_1.default
        .string()
        .min(3, { message: "Last name must be at least 3 characters" })
        .max(32, { message: "Last name cannot exceed 32 characters" }),
    username: zod_1.default
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(32, { message: "Username cannot exceed 32 characters" }),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    email: zod_1.default.string().email({ message: "Invalid email address" }),
});
exports.loginUser = zod_1.default.object({
    username: zod_1.default
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(32, { message: "Username cannot exceed 32 characters" }),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});
exports.senderRecipient = zod_1.default.object({
    sender: zod_1.default.string().uuid({ message: "Sender must be a valid UUID" }),
    recipient: zod_1.default.string().uuid({ message: "Recipient must be a valid UUID" }),
});
exports.uuid = zod_1.default.string().uuid({ message: "Must be a valid UUID" });
exports.name = zod_1.default
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(32, { message: "Username cannot exceed 32 characters" });
exports.createMessage = zod_1.default.object({
    sender: zod_1.default.string().uuid({ message: "Sender must be a valid UUID" }),
    recipient: zod_1.default.string().uuid({ message: "Recipient must be a valid UUID" }),
    friendship: zod_1.default.string().uuid({ message: "Friendship must be a valid UUID" }),
    images: zod_1.default.string().array().default([]),
    files: zod_1.default.string().array().default([]),
    content: zod_1.default.string(),
});
exports.message = zod_1.default.object({
    type: zod_1.default.string(),
    sender: zod_1.default.string().uuid({ message: "Sender must be a valid UUID" }),
    recipient: zod_1.default.string().uuid({ message: "Recipient must be a valid UUID" }),
    content: zod_1.default.string(),
    date: zod_1.default.string().default(new Date().toISOString()),
    images: zod_1.default.string().array().default([]),
    files: zod_1.default.string().array().default([]),
});
exports.liveMessage = zod_1.default.object({
    type: zod_1.default.string(),
    sender: zod_1.default.string().uuid({ message: "Sender must be a valid UUID" }),
    liveId: zod_1.default.string().uuid({ message: "LiveId must be a valid UUID" }),
    content: zod_1.default.string(),
});
exports.videoCallInvitationRequest = zod_1.default.object({
    type: zod_1.default.string(),
    room: zod_1.default.string().uuid({ message: "Room must be a valid UUID" }),
    sender: zod_1.default.string().uuid({ message: "Sender must be a valid UUID" }),
    recipient: zod_1.default.string().uuid({ message: "Recipient must be a valid UUID" }),
});
exports.createNotification = zod_1.default.object({
    sender: zod_1.default.string().uuid({ message: "Sender must be a valid UUID" }),
    recipient: zod_1.default.string().uuid({ message: "Recipient must be a valid UUID" }),
    content: zod_1.default.string().min(1, { message: "Invalid content size" }),
    seen: zod_1.default.boolean().default(false),
    type: zod_1.default.string(),
});
exports.updateProfilePublicInformation = zod_1.default.object({
    firstName: zod_1.default
        .string()
        .min(3, { message: "First name must be at least 3 characters" })
        .max(32, { message: "First name cannot exceed 32 characters" })
        .optional(),
    lastName: zod_1.default
        .string()
        .min(3, { message: "Last name must be at least 3 characters" })
        .max(32, { message: "Last name cannot exceed 32 characters" })
        .optional(),
    username: zod_1.default
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(32, { message: "Username cannot exceed 32 characters" })
        .optional(),
    email: zod_1.default.string().email({ message: "Invalid email address" }).optional(),
});
exports.url = zod_1.default.string().url();
exports.createPublication = zod_1.default.object({
    publisherId: zod_1.default
        .string()
        .uuid({ message: "Publisher ID must be a valid UUID" }),
    description: zod_1.default.string().default(""),
    images: zod_1.default
        .array(zod_1.default.string())
        .min(1, { message: "At least one image must be provided" }),
    publicationStatus: zod_1.default.enum(["draft", "published"]),
});
exports.updatePublication = zod_1.default.object({
    content: zod_1.default.string().default("").optional(),
    images: zod_1.default.array(zod_1.default.string()).optional(),
    publicationStatus: zod_1.default.enum(["draft", "published"]).optional(),
});
exports.createStory = zod_1.default.object({
    userId: zod_1.default.string().uuid(),
    videoUrl: zod_1.default.string(),
    description: zod_1.default.string().default(""),
});
exports.createGroup = zod_1.default.object({
    userId: zod_1.default.string().uuid(),
    name: zod_1.default.string(),
    description: zod_1.default.string().default(""),
    imageUrl: zod_1.default.string(),
});
