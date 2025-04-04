<script setup lang="ts">
import { reactive, ref } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import useVuelidate from "@vuelidate/core";
import { useAuthStore } from "../../../stores/auth.store";
import { useRouter } from "vue-router";
import { required, email, minLength } from "@vuelidate/validators";
import Swal from "sweetalert2";
// Add icons to library
library.add(faUser, faLock, faEye, faEyeSlash);
const router = useRouter();
const authStore = useAuthStore();
const showPassword = ref(false);
const isLoading = ref(false);
const error = ref("");

const form = reactive({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) },
};
const v$ = useVuelidate(rules, form);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  error.value = "";
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  try {
    isLoading.value = true;
    const response = await authStore.login(form.email, form.password);

    if (response.user.role !== "admin") {
      throw new Error("Access denied. Admin privileges required.");
    }

    await Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back, Admin!",
      timer: 1500,
      showConfirmButton: false,
    });

    // Redirect to saved URL or dashboard
    const returnUrl = authStore.returnUrl || '/admin/dashboard';
    router.push(returnUrl);
  } catch (err: any) {
    error.value = err.message || "Login failed. Please try again.";
    await Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.value,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <!-- error alert -->
        <div v-if="error" class="error-alert">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
          {{ error }}
        </div>
        <!-- Email Input -->
        <div class="input-group">
          <font-awesome-icon :icon="['fas', 'user']" class="icon" />
          <input
            type="email"
            v-model="form.email"
            :class="{ error: v$.email.$error }"
            placeholder="Email"
            @blur="v$.email.$touch()"
          />
          <span v-if="v$.email.$error" class="error-text">
            {{ v$.email.$errors[0].$message }}
          </span>
        </div>

        <!-- Password Input -->
        <div class="input-group">
          <font-awesome-icon :icon="['fas', 'lock']" class="icon" />
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            :class="{ error: v$.password.$error }"
            placeholder="Password"
            @blur="v$.password.$touch()"
          />
          <font-awesome-icon
            :icon="showPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']"
            class="toggle-password"
            @click="togglePassword"
          />
          <span v-if="v$.password.$error" class="error-text">
            {{ v$.password.$errors[0].$message }}
          </span>
        </div>

        <button type="submit" :disabled="isLoading" class="login-button">
          <span v-if="!isLoading">Login</span>
          <font-awesome-icon v-else icon="spinner" spin />
        </button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.error-alert {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.input-group input.error {
  border-color: #dc2626;
}

.error-text {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  text-align: left;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  border: none;
  color: white;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #0056b3;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f3f4f6;
}

.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 18px;
}

.input-group input {
  width: 100%;
  padding: 10px 35px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
  font-size: 18px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
