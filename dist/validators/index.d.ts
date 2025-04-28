import z from 'zod';
export declare const create_user: z.ZodObject<{
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
export declare const login_user: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const sender_recipient: z.ZodObject<{
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
export declare const create_message: z.ZodObject<{
    sender: z.ZodString;
    recipient: z.ZodString;
    friendship: z.ZodString;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    files: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sender: string;
    recipient: string;
    friendship: string;
    images: string[];
    files: string[];
    content: string;
}, {
    sender: string;
    recipient: string;
    friendship: string;
    content: string;
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
    sender: string;
    recipient: string;
    images: string[];
    files: string[];
    content: string;
    date: string;
}, {
    type: string;
    sender: string;
    recipient: string;
    content: string;
    images?: string[] | undefined;
    files?: string[] | undefined;
    date?: string | undefined;
}>;
export declare const live_message: z.ZodObject<{
    type: z.ZodString;
    sender: z.ZodString;
    liveId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    sender: string;
    content: string;
    liveId: string;
}, {
    type: string;
    sender: string;
    content: string;
    liveId: string;
}>;
export declare const video_call_invitation_request: z.ZodObject<{
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
export declare const create_notification: z.ZodObject<{
    sender: z.ZodString;
    recipient: z.ZodString;
    content: z.ZodString;
    seen: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    seen: boolean;
    sender: string;
    recipient: string;
    content: string;
}, {
    type: string;
    sender: string;
    recipient: string;
    content: string;
    seen?: boolean | undefined;
}>;
export declare const update_profile_public_information: z.ZodObject<{
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
export declare const create_publication: z.ZodObject<{
    publisher_id: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    images: z.ZodArray<z.ZodString, "many">;
    publication_status: z.ZodEnum<["draft", "published"]>;
}, "strip", z.ZodTypeAny, {
    images: string[];
    publisher_id: string;
    description: string;
    publication_status: "draft" | "published";
}, {
    images: string[];
    publisher_id: string;
    publication_status: "draft" | "published";
    description?: string | undefined;
}>;
export declare const update_publication: z.ZodObject<{
    content: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    publication_status: z.ZodOptional<z.ZodEnum<["draft", "published"]>>;
}, "strip", z.ZodTypeAny, {
    images?: string[] | undefined;
    content?: string | undefined;
    publication_status?: "draft" | "published" | undefined;
}, {
    images?: string[] | undefined;
    content?: string | undefined;
    publication_status?: "draft" | "published" | undefined;
}>;
export declare const create_story: z.ZodObject<{
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
export declare const create_group: z.ZodObject<{
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