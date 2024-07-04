// 管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/api/login'

export const useUserStore = defineStore('user', () => {
  // 1. 定义管理用户数据的state
  const userInfo = ref({})
  // 2. 定义获取接口数据的action函数

  const getUserInfo = async (user) => {
    try {
      console.log(user);
      // 可以在这里添加更多的用户输入验证逻辑
      const res = await loginAPI(user);
      console.log(res);
      userInfo.value = res.data;
      console.log(userInfo.value);
      return res;
      // 成功提示或操作...
    } catch (error) {
      // 错误处理逻辑
      console.error('Failed to fetch user info:', error);
      // 可能还需要清除userInfo或设置默认值
      userInfo.value = {};
      // 根据需要展示错误信息给用户
    }
  }
  //退出时清除用户数据

  const clearUserInfo = () => {
    userInfo.value = {};
  }

  // 3. 以对象的格式把state和action return
  return {
    userInfo,
    getUserInfo,
    clearUserInfo
  }
}, {
  persist: true,
})