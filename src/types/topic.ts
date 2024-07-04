export interface Request_topic {
    circleId?: number;
    circleName?: string;
    groupId?: number;
    groupName?: string;
    p?: number;
    s?: number;
    topicId?: string;
    topicName?: string;
    [property: string]: any;
}
export interface Response_topic {
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
    topicId: number;
    topicName: string;
    topicPostCount: number;
    [property: string]: any;
}

export interface Request_topic_add {
    circleId: number;
    groupId: number;
    topicName: string;
    [property: string]: any;
}

export interface Request_group_update {
    topicId: number;
    topicName: string;
    [property: string]: any;
}

export interface Request_topic {
    topicId: number;
    [property: string]: any;
}