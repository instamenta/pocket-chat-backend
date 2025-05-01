export interface UserSchemaStruct {
    id: string;
    email: string;
    picture: string;
    username: string;
    password: string;
    bio: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    lastActiveAt: string;
}
export interface UserDataPayloadStruct {
    id: string;
    email: string;
    picture: string;
    username: string;
}
export interface GetUserByUsernameStruct {
    id: string;
    username: string;
    password: string;
    email: string;
    picture: string;
}
//# sourceMappingURL=user.d.ts.map