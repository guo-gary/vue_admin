import httpInstance from "@/utils/http";

export async function getPostAPI(data) {

    // 使用httpInstance发送GET请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/post",
        method: "get",
        params: data,

    });
}

export async function addPostAPI(data) {

    // 使用httpInstance发送post请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/post",
        method: "post",
        data: data,

    });
}

export async function deletePostAPI(data) {

    // 使用httpInstance发送delete请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/post",
        method: "delete",
        params: data,

    });
}

export async function getOnePostAPI(data) {
    const postId = data.postId;
    // 使用httpInstance发送get请求，并在请求头中设置Token
    return httpInstance({
        url: `/api/admin/post/${postId}`,
        method: "get",
        params: data,
    });
}

export async function updatePostAPI(data) {

    // 使用httpInstance发送post请求，并在请求头中设置Token
    return httpInstance({
        url: "/api/admin/post",
        method: "put",
        data: data,

    });
}