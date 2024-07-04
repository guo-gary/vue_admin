import httpInstance from "@/utils/http";

export async function getCircleAPI(data) {

    // 使用httpInstance发送GET请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/circle",
        method: "get",
        params: data,

    });
}

export async function addCircleAPI(data) {

    // 使用httpInstance发送Circle请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/circle",
        method: "post",
        data: data,

    });
}

export async function deleteCircleAPI(data) {
    const circleId = data.circleId;
    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: `/api/admin/circle/${circleId}`,
        method: "delete",
        params: data,

    });
}

export async function getOneCircleAPI(data) {
    const circleId = data.circleId;
    // 使用httpInstance发送get请求，并在请求头中设置Token
    return httpInstance({
        url: `/api/admin/circle/${circleId}`,
        method: "get",
        params: data,
    });
}

export async function updateCircleAPI(data) {

    // 使用httpInstance发送Circle请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/circle/update",
        method: "put",
        data: data,

    });
}