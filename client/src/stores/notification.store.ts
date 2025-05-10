import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    message: "",
    type: "error" as "success" | "error" | "info",
    show: false,
  }),
  actions: {
    showMessage(message: string, type: "success" | "error" | "info" = "error") {
      this.message = message;
      this.type = type;
      this.show = true;
      setTimeout(() => (this.show = false), 5000);
    },
  },
});
