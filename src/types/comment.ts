export interface Request_comment {
    /**
     * 圈子id
     */
    circleId?: string;
    /**
     * 圈子名称
     */
    circleName?: string;
    /**
     * 群组id
     */
    groupId?: string;
    /**
     * 群组名称
     */
    groupName?: string;
    /**
     * 页码数
     */
    p: string;
    /**
     * 评论内容
     */
    postComment?: string;
    /**
     * 评论id
     */
    postCommentId?: string;
    /**
     * 帖子id
     */
    postId?: string;
    /**
     * 帖子标题
     */
    postTitle?: string;
    /**
     * 页码大小
     */
    s: string;
    /**
     * 话题id
     */
    topicId?: string;
    /**
     * 话题名称
     */
    topicName?: string;
    /**
     * 用户id
     */
    userId?: string;
    /**
     * 用户名称
     */
    userName?: string;
    [property: string]: any;
}

export interface Response_comment {
    records: Record[];
    total: number;
    [property: string]: any;
}

export interface Record {
    commentContent?: string;
    commentLikeCount?: number;
    postCommentCreateTime?: string;
    postCommentId?: number;
    postId?: number;
    postUserId?: number;
    replyCommentId?: null;
    userId?: number;
    [property: string]: any;
}


export interface Request_comment_delete {
    /**
     * 评论id
     */
    ids?: string;
    [property: string]: any;
}