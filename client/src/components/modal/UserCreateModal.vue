<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box w-11/12 max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold">Create New User</h3>
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <!-- form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name*</span>
            </label>
            <input
              type="text"
              v-model="formData.name"
              placeholder="Full name"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.name }"
            />
            <p v-if="errors.name" class="text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>
          <!-- email -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email*</span>
            </label>
            <input
              type="text"
              v-model="formData.email"
              placeholder="user@example.co"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>
          <!-- password -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password*</span>
            </label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="At least 8 characters"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.password }"
            />
            <p v-if="errors.password" class="text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
          <!-- role -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Role*</span>
            </label>
            <select
              v-model="formData.role"
              class="select select-bordered w-full"
              :class="{ 'input-error': errors.role }"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <p v-if="errors.role" class="text-sm text-red-600">
              {{ errors.role }}
            </p>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Profile Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="file-input file-input-bordered w-full"
            />
            <div v-if="imagePreview" class="mt-2 flex justify-center">
              <img
                :src="imagePreview"
                class="w-20 h-20 rounded-full object-cover border"
                alt="Profile Preview"
              />
            </div>
          </div>
          <!-- Gender -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Gender</span>
            </label>
            <select
              v-model="formData.gender"
              class="select select-bordered w-full"
            >
              <option :value="null">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors.gender" class="text-sm text-red-600">
              {{ errors.gender }}
            </p>
          </div>
          <!-- phone -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone</span>
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              placeholder="Phone number"
              class="input input-bordered w-full"
            />
            <p v-if="errors.phone" class="text-sm text-red-600">
              {{ errors.phone }}
            </p>
          </div>
          <!-- address -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Address</span>
            </label>
            <input
              v-model="formData.address"
              type="text"
              placeholder="Street address"
              class="input input-bordered w-full"
            />
          </div>
          <!-- postal code -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Postal Code</span>
            </label>
            <input
              v-model="formData.postal_code"
              type="text"
              placeholder="Postal code"
              class="input input-bordered w-full"
            />
          </div>
          <!-- country -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Country</span>
            </label>
            <input
              v-model="formData.country"
              type="text"
              placeholder="Country"
              class="input input-bordered w-full"
            />
          </div>
          <!-- bio -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Bio</span>
            </label>
            <textarea
              v-model="formData.bio"
              placeholder="Short bio..."
              class="textarea textarea-bordered w-full"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- action -->
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-ghost"
            @click="closeModal"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :class="{ loading: isSubmitting }"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Creating..." : "Create User" }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import type { UserForm } from "../../types/user_list.type";
import api from "../../config/axios";

const modal: Ref<HTMLDialogElement | null> = ref(null);
const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);
const errors = ref<{ [key: string]: string }>({}); // Error messages
const formData = ref<UserForm>({
  name: "",
  email: "",
  password: "",
  bio: null,
  gender: null,
  phone: null,
  address: null,
  postal_code: null,
  country: null,
  role: "user",
  is_active: true,
  profile_image: null,
});
const emit = defineEmits(["user-created", "user-creation-error"]);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    formData.value.profile_image = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const openModal = () => {
  modal.value?.showModal();
};

const closeModal = () => {
  resetForm();
  imagePreview.value = null;
  modal.value?.close();
};

const resetForm = () => {
  formData.value = {
    name: "",
    email: "",
    password: "",
    bio: null,
    gender: null,
    phone: null,
    address: null,
    postal_code: null,
    country: null,
    role: "user",
    is_active: true,
    profile_image: null,
  };
  imagePreview.value = null;
  errors.value = {}; // Reset errors
};

const validateForm = () => {
  errors.value = {}; // Reset errors before validation
  let isValid = true;

  if (!formData.value.name) {
    errors.value.name = "Name is required.";
    isValid = false;
  }
  if (!formData.value.email) {
    errors.value.email = "Email is required.";
    isValid = false;
  }
  if (!formData.value.password || formData.value.password.length < 8) {
    errors.value.password = "Password must be at least 8 characters.";
    isValid = false;
  }
  if (!formData.value.role) {
    errors.value.role = "Role is required.";
    isValid = false;
  }
  if (!formData.value.gender) {
    errors.value.gender = "Gender is required.";
    isValid = false;
  }
  return isValid;
};
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const formDataObj = new FormData();
    Object.entries(formData.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataObj.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await api.post("/users/register", formDataObj, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    emit("user-created", response.data.user);
    closeModal();
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "User creation failed";
    console.error("Registration error:", error);

    // Emit the error with proper structure
    emit("user-creation-error", {
      message: errorMessage,
      details: error.response?.data?.errors || null,
    });
  } finally {
    isSubmitting.value = false;
  }
};
defineExpose({
  openModal,
  closeModal,
});
</script>
