import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers";
import "./assets/styles/index.css";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import {
  faHome,
  faBox,
  faUsers,
  faEllipsisV,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Add icons to the library before creating the app
library.add(faHome, faBox, faUsers, faEllipsisV, faSpinner);

const app = createApp(App);

// Register FontAwesomeIcon as a global component
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(Toast, {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  hideProgressBar: false,
  newestOnTop: true,
  pauseOnHover: true,
  rtl: false,
  transition: "Vue-Toastification__bounce", 
  maxToasts: 5,
  closeButton: "button",
  icon: true,
});
app.use(createPinia());
app.use(router);
app.mount("#app");

document.title = "Swap Book | Home";
