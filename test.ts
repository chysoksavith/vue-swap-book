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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Left Column -->
          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Full name"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Email*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="user@example.com"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Password*</span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="At least 8 characters"
                class="input input-bordered w-full"
                required
                minlength="8"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Role*</span>
              </label>
              <select
                v-model="formData.role"
                class="select select-bordered w-full"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
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
                  alt="Preview"
                  class="w-20 h-20 rounded-full object-cover border"
                />
              </div>
            </div>

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
            </div>

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
            </div>

            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-2">
                <input
                  v-model="formData.is_active"
                  type="checkbox"
                  class="toggle toggle-primary"
                  :true-value="true"
                  :false-value="false"
                />
                <span class="label-text">Active User</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Additional Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            :class="{ 'loading': isSubmitting }"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

interface UserForm {
  name: string
  email: string
  password: string
  bio: string | null
  gender: string | null
  phone: string | null
  address: string | null
  postal_code: string | null
  country: string | null
  role: string
  is_active: boolean
  profile_image: File | null
}

const modal: Ref<HTMLDialogElement | null> = ref(null)
const imagePreview = ref<string | null>(null)
const isSubmitting = ref(false)

const formData = ref<UserForm>({
  name: '',
  email: '',
  password: '',
  bio: null,
  gender: null,
  phone: null,
  address: null,
  postal_code: null,
  country: null,
  role: 'user',
  is_active: true,
  profile_image: null
})

const emit = defineEmits(['user-created'])

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    formData.value.profile_image = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

const openModal = () => {
  modal.value?.showModal()
}

const closeModal = () => {
  resetForm()
  modal.value?.close()
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    password: '',
    bio: null,
    gender: null,
    phone: null,
    address: null,
    postal_code: null,
    country: null,
    role: 'user',
    is_active: true,
    profile_image: null
  }
  imagePreview.value = null
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const formDataObj = new FormData()
    
    // Append all form fields
    Object.entries(formData.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataObj.append(key, value instanceof File ? value : String(value))
      }
    })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('user-created', { ...formData.value })
    closeModal()
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({
  openModal,
  closeModal
})
</script>
<template>
  <!-- Your existing template -->
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="flex justify-between items-center mb-3">
        <h2 class="card-title">User Management</h2>
        <button 
          class="btn btn-sm btn-primary"
          @click="userModal.openModal()"
        >
          Create User
        </button>
      </div>
      
      <!-- Your existing user table -->
    </div>
  </div>

  <UserCreateModal ref="userModal" @user-created="handleUserCreated" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserCreateModal from './UserCreateModal.vue'

const userModal = ref<InstanceType<typeof UserCreateModal> | null>(null)

const handleUserCreated = (newUser: any) => {
  // Handle the new user (add to table or refresh data)
  console.log('New user created:', newUser)
  // fetchUsers() // Uncomment if you have this function
}
</script>