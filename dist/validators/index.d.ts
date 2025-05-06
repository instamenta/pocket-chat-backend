import z from "zod";
export declare const createUser: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
}, {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
}>;
export declare const loginUser: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const senderRecipient: z.ZodObject<{
    sender: z.ZodString;
    recipient: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sender: string;
    recipient: string;
}, {
    sender: string;
    recipient: string;
}>;
export declare const uuid: z.ZodString;
export declare const name: z.ZodString;
export declare const createMessage: z.ZodObject<{
    sender: z.ZodString;
    recipient: z.ZodString;
    friendship: z.ZodString;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    images: string[];
    sender: string;
    recipient: string;
    friendship: string;
    files: string[];
}, {
    content: string;
    sender: string;
    recipient: string;
    friendship: string;
    images?: string[] | undefined;
    files?: string[] | undefined;
}>;
export declare const message: z.ZodObject<{
    type: z.ZodString;
    sender: z.ZodString;
    recipient: z.ZodString;
    content: z.ZodString;
    date: z.ZodDefault<z.ZodString>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: string;
    content: string;
    images: string[];
    sender: string;
    recipient: string;
    files: string[];
    date: string;
}, {
    type: string;
    content: string;
    sender: string;
    recipient: string;
    images?: string[] | undefined;
    files?: string[] | undefined;
    date?: string | undefined;
}>;
export declare const liveMessage: z.ZodObject<{
    type: z.ZodString;
    sender: z.ZodString;
    liveId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    content: string;
    sender: string;
    liveId: string;
}, {
    type: string;
    content: string;
    sender: string;
    liveId: string;
}>;
export declare const videoCallInvitationRequest: z.ZodObject<{
    type: z.ZodString;
    room: z.ZodString;
    sender: z.ZodString;
    recipient: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    sender: string;
    recipient: string;
    room: string;
}, {
    type: string;
    sender: string;
    recipient: string;
    room: string;
}>;
export declare const createNotification: z.ZodObject<{
    sender: z.ZodString;
    recipient: z.ZodString;
    content: z.ZodString;
    seen: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    seen: boolean;
    content: string;
    sender: string;
    recipient: string;
}, {
    type: string;
    content: string;
    sender: string;
    recipient: string;
    seen?: boolean | undefined;
}>;
export declare const updateProfilePublicInformation: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
}>;
export declare const url: z.ZodString;
export declare const createPublication: z.ZodObject<{
    publisherId: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    images: z.ZodArray<z.ZodString, "many">;
    publicationStatus: z.ZodEnum<["draft", "published"]>;
}, "strip", z.ZodTypeAny, {
    publisherId: string;
    description: string;
    images: string[];
    publicationStatus: "draft" | "published";
}, {
    publisherId: string;
    images: string[];
    publicationStatus: "draft" | "published";
    description?: string | undefined;
}>;
export declare const updatePublication: z.ZodObject<{
    content: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    publicationStatus: z.ZodOptional<z.ZodEnum<["draft", "published"]>>;
}, "strip", z.ZodTypeAny, {
    content?: string | undefined;
    images?: string[] | undefined;
    publicationStatus?: "draft" | "published" | undefined;
}, {
    content?: string | undefined;
    images?: string[] | undefined;
    publicationStatus?: "draft" | "published" | undefined;
}>;
export declare const createStory: z.ZodObject<{
    userId: z.ZodString;
    videoUrl: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    userId: string;
    videoUrl: string;
}, {
    userId: string;
    videoUrl: string;
    description?: string | undefined;
}>;
export declare const createGroup: z.ZodObject<{
    userId: z.ZodString;
    name: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    imageUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    userId: string;
    name: string;
    imageUrl: string;
}, {
    userId: string;
    name: string;
    imageUrl: string;
    description?: string | undefined;
}>;
//# sourceMappingURL=index.d.ts.map