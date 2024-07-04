import httpInstance from "@/utils/http";

export async function getTopicAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/topic",
        method: "get",
        params: data,
    });
}

export async function addTopicAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/topic",
        method: "post",
        data: data,
    });
}
export async function updateTopicAPI(data) {

    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/topic",
        method: "put",
        data: data,

    });
}

export async function deleteTopicAPI(data) {
    const topicId = data.topicId;
    // 使用httpInstance发送get请求，并在请求头中设置Token
    return httpInstance({
        url: `/api/admin/topic/${topicId}`,
        method: "delete",
        params: data,
    });
}
