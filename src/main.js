import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
const app = createApp(App)
app.use(store).use(VueAxios, axios).use(ElementPlus).use(router).mount('#app')
