import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers";


import { createPinia } from "pinia";
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

document.title = "Swap Book | Home";
