import httpInstance from "@/utils/http";
const baseURL = httpInstance.defaults.baseURL;
export function getAction() {
    const action = `${baseURL}/file/upload`;
    console.log(action);
    return action;
}
export const getUploadFile = `${baseURL}/file/upload`;
export function getFile(data) {
    return `${baseURL}/static/img/${data}`;
}
export async function getUploadFileAPI(data) {
    console.log(data);
    alert('dd')
    return httpInstance({
        url: '/file/upload',
        method: "post",
        data:data,
      });
    // 发送上传请求
    // axios.post('/file/upload', { file: data })
    //     .then(response => {
    //         // 假设服务器返回图片路径
    //         avatarImg.value = response.data.imagePath;
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
}