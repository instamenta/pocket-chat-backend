import z from 'zod';
export declare class Validate {
    static create_user: z.ZodObject<{
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
    static login_user: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        username: string;
        password: string;
    }, {
        username: string;
        password: string;
    }>;
    static sender_recipient: z.ZodObject<{
        sender: z.ZodString;
        recipient: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sender: string;
        recipient: string;
    }, {
        sender: string;
        recipient: string;
    }>;
    static uuid: z.ZodString;
    static name: z.ZodString;
    static create_message: z.ZodObject<{
        sender: z.ZodString;
        recipient: z.ZodString;
        friendship: z.ZodString;
        images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        files: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        files: string[];
        sender: string;
        recipient: string;
        friendship: string;
        images: string[];
        content: string;
    }, {
        sender: string;
        recipient: string;
        friendship: string;
        content: string;
        files?: string[] | undefined;
        images?: string[] | undefined;
    }>;
    static message: z.ZodObject<{
        type: z.ZodString;
        sender: z.ZodString;
        recipient: z.ZodString;
        content: z.ZodString;
        date: z.ZodDefault<z.ZodString>;
        images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        files: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        files: string[];
        type: string;
        sender: string;
        recipient: string;
        images: string[];
        content: string;
        date: string;
    }, {
        type: string;
        sender: string;
        recipient: string;
        content: string;
        files?: string[] | undefined;
        images?: string[] | undefined;
        date?: string | undefined;
    }>;
    static live_message: z.ZodObject<{
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
    static video_call_invitation_request: z.ZodObject<{
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
    static create_notification: z.ZodObject<{
        sender: z.ZodString;
        recipient: z.ZodString;
        content: z.ZodString;
        seen: z.ZodDefault<z.ZodBoolean>;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        sender: string;
        recipient: string;
        content: string;
        seen: boolean;
    }, {
        type: string;
        sender: string;
        recipient: string;
        content: string;
        seen?: boolean | undefined;
    }>;
    static update_profile_public_information: z.ZodObject<{
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
    static url: z.ZodString;
    static create_publication: z.ZodObject<{
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
    static update_publication: z.ZodObject<{
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
    static create_story: z.ZodObject<{
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
    static create_group: z.ZodObject<{
        userId: z.ZodString;
        name: z.ZodString;
        description: z.ZodDefault<z.ZodString>;
        imageUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        userId: string;
        imageUrl: string;
    }, {
        name: string;
        userId: string;
        imageUrl: string;
        description?: string | undefined;
    }>;
}
//# sourceMappingURL=index.d.ts.map