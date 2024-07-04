import httpInstance from "@/utils/http";

export async function getGroupAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/group",
        method: "get",
        params: data,
    });
}

export async function addGroupAPI(data) {
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/group",
        method: "post",
        data: data,
    });
}
export async function updateGroupAPI(data) {

    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/group",
        method: "put",
        data: data,

    });
}
export async function deleteGroupAPI(data) {

    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/group",
        method: "delete",
        params: { ids: data.ids+''} ,
    });
}