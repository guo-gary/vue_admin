export interface Request_by_id {
    /**
     * 分页查询评论的回复
     */
    id?: string;
    /**
     * 页码数
     */
    p?: string;
    /**
     * 页码大小
     */
    s?: string;
    [property: string]: any;
}

export interface Response_by_id {
    records: Record_by_id[];
    total: number;
    [property: string]: any;
}

export interface Record_by_id {
    createTime: string;
    postId: number;
    postReplyId: number;
    replyCommentId: number;
    replyContent: string;
    replyUserId: number;
    secReplyId: number;
    userId: number;
    [property: string]: any;
}

export interface Request_by_replyContent {
    /**
     * 页码数
     */
    p?: string;
    /**
     * 回复内容
     */
    replyContent?: string;
    /**
     * 页码大小
     */
    s?: string;
    [property: string]: any;
}

export interface Response_by_replyContent {
    records: Record_by_replyContent[];
    total: number;
    [property: string]: any;
}

export interface Record_by_replyContent {
    createTime: string;
    postId: number;
    postReplyId: number;
    replyCommentId: number;
    replyContent: string;
    replyUserId: number;
    secReplyId: number;
    userId: number;
    [property: string]: any;
}

export interface Request_delete {
    /**
     * 回复的ids
     */
    ids?: string;
    [property: string]: any;
}