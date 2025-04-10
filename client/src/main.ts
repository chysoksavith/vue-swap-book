import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers";
import "./assets/styles/index.css";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faBox,
  faUsers,
  faEllipsisV,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Add icons to the library before creating the app
library.add(faHome, faBox, faUsers, faEllipsisV, faSpinner);

const app = createApp(App);

// Register FontAwesomeIcon as a global component
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.mount("#app");

document.title = "Swap Book | Home";
