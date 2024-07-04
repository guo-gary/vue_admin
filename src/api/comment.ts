import httpInstance from "@/utils/http";

export async function getCommentAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/comment",
        method: "get",
        params: data,
    });
}


export async function deleteCommentAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/comment",
        method: "delete",
        params: { ids: data.ids+''} ,
    });
}