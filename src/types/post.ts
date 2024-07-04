export interface Request_post {
    circleId?: string;
    circleName?: string;
    groupId?: string;
    groupName?: string;
    /**
     * 不传则全查，0未删除的，1已删除的
     */
    isDelete?: string;
    p?: string;
    postId?: string;
    postTitle?: string;
    s?: string;
    topicId?: string;
    topicName?: string;
    userId?: string;
    [property: string]: any;
}export interface Response_post {
    code: number;
    data: Data;
    msg: null;
    [property: string]: any;
}

export interface Data {
    records: Record[];
    total: number;
    [property: string]: any;
}

export interface Record {
    circleId: number;
    groupId: number;
    isDelete: number;
    postCommentCount: number;
    postContent: string;
    postCreateTime: null | string;
    postId: number;
    postImgUrls: null | string;
    postLikeCount: number;
    postTitle: null | string;
    postUpdateTime: null | string;
    topicId: number | null;
    userId: number;
    [property: string]: any;
}

export interface Request_post_detail {
    /**
     * 帖子id
     */
    postId: number;
    [property: string]: any;
}

export interface Response_post_detail {
    code: number;
    data: Data;
    msg: null;
    [property: string]: any;
}

export interface Data_post_detail {
    circleId: number;
    postCommentCount: number;
    postContent: string;
    postCreateTime: null;
    postId: number;
    postImgUrls: null;
    postIsDelete: number;
    postLikeCount: number;
    postUpdateTime: null;
    userId: number;
    [property: string]: any;
}

export interface Request_post_add {
    groupId: number;
    postContent: string;
    postImgUrls: string;
    postTitle: string;
    /**
     * 没有则自动创建
     */
    topicName: string;
    userId: number;
    [property: string]: any;
}

export interface Request_post_update {
    groupId: number;
    postContent: string;
    postId: number;
    postImgUrls: string;
    postTitle: string;
    topicName: string;
    userId: number;
    [property: string]: any;
}

export interface Request_post_delete {
    /**
     * 帖子id
     */
    postId: number;
    [property: string]: any;
}