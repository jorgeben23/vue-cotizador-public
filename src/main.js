import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes/routes";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "./store";

// axios.defaults.baseURL = 'https://localhost:5001' // aqui definimos la url para no estar poniendo http:localhost ....

createApp(App).use(router).use(VueAxios, axios).use(store).mount("#app");
