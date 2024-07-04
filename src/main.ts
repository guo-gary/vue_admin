import { createApp } from 'vue';
import { createPinia } from 'pinia';
//1.引入piniaPersist持久化插件

import { createPersistedState } from 'pinia-plugin-persistedstate'

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
const pinia =createPinia();
// 使用pinia-plugin-persistedstate插件
pinia.use(createPersistedState())
const app = createApp(App);
app.use(pinia);
app.use(router);


// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (binding.value && !permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});

app.mount('#app');
