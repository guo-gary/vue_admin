export interface Request_circle {
    /**
     * 圈名
     */
    circleName?: string;
    /**
     * 是否禁用 0 正常 1 禁用
     */
    CircleStatus?: string;
    /**
     * 是否删除 0 正常 1 已删除
     */
    isDelete?: string;
    p: string;
    s: string;
    [property: string]: any;
}
export interface Response_circle {
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
    circleAvatar: string;
    circleBackground: string;
    circleCreateTime: string;
    circleDescription: string;
    circleId: number;
    circleName: string;
    circlePostCount: number;
    circleStatus: number;
    circleType: null | string;
    circleUpdateTime: string;
    circleUserCount: number;
    isDelete: number;
    [property: string]: any;
}
export interface Request_circle_detail {
    circleId: number;
    [property: string]: any;
}
export interface Response_circle_detail {
    code: number;
    data: Data_circle_detail;
    msg: null;
    [property: string]: any;
}

export interface Data_circle_detail {   
    circleAvatar: string;
    circleBackground: string;
    circleCreateTime: string;
    circleDescription: string;
    circleId: number;
    circleName: string;
    circlePostCount: number;
    circleType: string;
    circleUpdateTime: string;
    circleUserCount: number;
    [property: string]: any;
}
export interface Request_circle_add {
    /**
     * 圈子头像
     */
    circleAvatar: string;
    /**
     * 圈子背景
     */
    circleBackground: string;
    /**
     * 圈子描述
     */
    circleDescription: string;
    /**
     * 圈子名称
     */
    circleName: string;
    [property: string]: any;
}
export interface Request_circle_update {
    circleAvatar: string;
    circleBackground: string;
    circleDescription: string;
    circleId: number;
    circleName: string;
    circleStatus: number;
    circleType: string;
    isDelete: number;
    [property: string]: any;
}
export interface Request_circle_delete {
    circleId: number;
    [property: string]: any;
}