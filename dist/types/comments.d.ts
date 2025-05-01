export interface CommentStructure {
    id: string;
    content: string;
    createdAt: string;
    publicationId: string;
    userId: string;
}
export interface PopulatedCommentStructure {
    id: string;
    content: string;
    createdAt: string;
    publicationId: string;
    userId: string;
    username: string;
    picture: string;
    likedByUser: boolean;
    firstName: string;
    lastName: string;
    likesCount: number;
}
//# sourceMappingURL=comments.d.ts.map