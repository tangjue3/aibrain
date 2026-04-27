import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'splitpanes/dist/splitpanes.css'
import App from './App.vue'
import router from './router'
import './assets/styles/variables.css'
import './assets/styles/themes.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
