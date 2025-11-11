import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initAuth } from "./stores/authStore";
import "./assets/styles.css"; // tu CSS global

// Initialize auth before mounting the app
initAuth().then(() => {
  createApp(App).use(router).mount("#app");
});
