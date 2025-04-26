<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProfileStore } from "../../../stores/profileUser.store";
import { useToast } from "vue-toastification";
import api from "../../../config/axios";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

const profileUser = useProfileStore();
const isLoading = ref(true);
const toast = useToast();
const validationErrors = ref<ValidationErrors>({});
const isSubmitting = ref(false);
const changePasswordModal = ref<HTMLDialogElement | null>(null);

// Change user password
const passwordForm = ref<PasswordForm>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Modal control functions
const openModal = () => {
  if (changePasswordModal.value) {
    changePasswordModal.value.showModal();
    // Reset form when opening
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    validationErrors.value = {};
  }
};

const closeModal = () => {
  if (changePasswordModal.value) {
    changePasswordModal.value.close();
  }
};

const validateForm = (): boolean => {
  const errors: ValidationErrors = {};
  
  if (!passwordForm.value.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  
  if (!passwordForm.value.newPassword) {
    errors.newPassword = "New password is required";
  } else if (passwordForm.value.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }
  
  if (!passwordForm.value.confirmPassword) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const handlePasswordChange = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  
  try {
    const response = await api.patch("/users/change-password", {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    if (response.data.success) {
      toast.success("Password changed successfully");
      closeModal();
    }
  } catch (error: any) {
    if (error.response) {
      if (error.response.data.message) {
        validationErrors.value.general = error.response.data.message;
      } else if (error.response.data.errors) {
        validationErrors.value = {
          ...validationErrors.value,
          ...error.response.data.errors
        };
      }
    } else {
      toast.error("Failed to change password. Please try again.");
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (!profileUser.userProfile) {
    await profileUser.fetchProfile();
  }
  isLoading.value = false;
});
</script><!-- Change Password Button in Security Card -->
<div class="card-actions justify-end mt-4">
  <button @click="openModal" class="btn btn-sm btn-primary">Change Password</button>
  <button class="btn btn-sm btn-outline btn-secondary">
    View Sessions
  </button>
</div>

<!-- modal change password -->
<div>
  <dialog ref="changePasswordModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Change Password</h3>
      <form @submit.prevent="handlePasswordChange" class="mt-4 space-y-4">
        <!-- General Error -->
        <div v-if="validationErrors.general" class="alert alert-error text-sm p-2">
          {{ validationErrors.general }}
        </div>
        
        <!-- Current Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Current Password</span>
          </label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="Enter current password"
            class="input input-bordered w-full"
            :class="{ 'input-error': validationErrors.currentPassword }"
            @input="validationErrors.currentPassword = ''"
          />
          <label class="label" v-if="validationErrors.currentPassword">
            <span class="label-text-alt text-error">{{ validationErrors.currentPassword }}</span>
          </label>
        </div>
        
        <!-- New Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">New Password</span>
          </label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="Enter new password"
            class="input input-bordered w-full"
            :class="{ 'input-error': validationErrors.newPassword }"
            @input="validationErrors.newPassword = ''"
          />
          <label class="label" v-if="validationErrors.newPassword">
            <span class="label-text-alt text-error">{{ validationErrors.newPassword }}</span>
          </label>
          <label class="label">
            <span class="label-text-alt">Must be at least 8 characters</span>
          </label>
        </div>
        
        <!-- Confirm Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Confirm New Password</span>
          </label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="Confirm new password"
            class="input input-bordered w-full"
            :class="{ 'input-error': validationErrors.confirmPassword }"
            @input="validationErrors.confirmPassword = ''"
          />
          <label class="label" v-if="validationErrors.confirmPassword">
            <span class="label-text-alt text-error">{{ validationErrors.confirmPassword }}</span>
          </label>
        </div>
        
        <div class="modal-action">
          <button
            type="button"
            class="btn"
            @click="closeModal"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="loading loading-spinner"></span>
            {{ isSubmitting ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- Click outside to close -->
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</div>