import httpInstance from "@/utils/http";

export async function loginAPI(data) {
  return httpInstance({
    url: "/api/admin/login",
    method: "post",
    data:data,
  });
}

export async function enrollAPI(data) {
  return httpInstance({
    url: "/api/admin/reg",
    method: "post",
    data:data,
  });
}
