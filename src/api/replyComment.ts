import httpInstance from "@/utils/http";

export async function getReplyAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/replyComment",
        method: "get",
        params: data,
    });
}
export async function getReplyByContentAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/replyComment/list",
        method: "get",
        params: data,
    });
}

export async function deleteReplyCommentAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token`
    return httpInstance({
        url: "/api/admin/replyComment",
        method: "delete",
        params: { ids: data.ids+''} ,
    });
}