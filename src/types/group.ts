import group from "@/views/system/group.vue";

export interface Request_group {
    /**
     * 圈子ID
     */
    circleId?: string;
    /**
     * 圈子名称
     */
    circleName?: string;
    /**
     * 分组ID
     */
    groupId?: string;
    /**
     * 分组名称
     */
    groupName?: string;
    /**
     * 0未删除, 1已删除
     */
    isDelete?: string;
    /**
     * 页码数
     */
    p: string;
    /**
     * 页码大小
     */
    s: string;
    [property: string]: any;
}
export interface Response_group {
    records: Record[];
    total: number;
    [property: string]: any;
}

export interface Record {
    circleId: number;
    groupId: number;
    groupName: string;
    isDeleted: number;
    [property: string]: any;
}

export interface Request_group_add {
    /**
     * 圈子id
     */
    circleId: string;
    /**
     * 分组名称
     */
    groupName: string;
    [property: string]: any;
}

export interface Request_group_update {
    /**
     * 分组id
     */
    groupId: string;
    /**
     * 分组名称
     */
    groupName: string;
    [property: string]: any;
}

export interface Request_group_delete {
    ids?: string;
    [property: string]: any;
}