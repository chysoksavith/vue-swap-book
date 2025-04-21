<template>
  <div class="p-6 w-full mx-auto">
    <!-- Profile Header -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8"
    >
      <div class="avatar">
        <div
          class="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
        >
          <img
            :src="
              profileUser.userProfile?.profile_image ||
              '/assets/images/avatar.png'
            "
            alt="Admin Profile"
          />
        </div>
      </div>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-800">
          {{ profileUser.userProfile?.name }}
        </h1>
        <p class="text-gray-600">
          {{ profileUser.userProfile?.role || "Administrator" }}
          {{ profileUser.userProfile?.address || "Administrator" }}
          {{ profileUser.userProfile?.phone || "Administrator" }}
        </p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span class="badge badge-primary">Super Admin</span>
          <span class="badge badge-secondary">Verified</span>
          <span class="badge badge-accent">Active</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Profile
        </button>
        <button class="btn btn-outline btn-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Upgrade
        </button>
      </div>
    </div>

    <!-- Profile Tabs -->
    <div class="tabs tabs-boxed bg-base-200 mb-8">
      <a class="tab tab-active">Profile</a>
      <a class="tab">Settings</a>
      <a class="tab">Activity</a>
      <a class="tab">Security</a>
      <a class="tab">Billing</a>
    </div>

    <!-- Profile Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Personal Information Card -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Personal Information
          </h2>
          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Full Name</span>
              </label>
              <p class="font-medium">Sarah M. Johnson</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Email</span>
              </label>
              <p class="font-medium">sarah.johnson@example.com</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Phone</span>
              </label>
              <p class="font-medium">(555) 123-4567</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Location</span>
              </label>
              <p class="font-medium">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Details Card -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Account Details
          </h2>
          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Username</span>
              </label>
              <p class="font-medium">sarah_admin</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Role</span>
              </label>
              <p class="font-medium">Super Administrator</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Joined</span>
              </label>
              <p class="font-medium">January 15, 2021</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Last Active</span>
              </label>
              <p class="font-medium">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Card -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Security
          </h2>
          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text text-gray-500"
                  >Two-Factor Authentication</span
                >
              </label>
              <div class="flex items-center justify-between">
                <p class="font-medium">Enabled</p>
                <button class="btn btn-xs btn-outline btn-error">
                  Disable
                </button>
              </div>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500">Active Sessions</span>
              </label>
              <p class="font-medium">3 devices</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-500"
                  >Password Last Changed</span
                >
              </label>
              <p class="font-medium">30 days ago</p>
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-sm btn-primary">Change Password</button>
            <button class="btn btn-sm btn-outline btn-secondary">
              View Sessions
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity Card -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Recent Activity
          </h2>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="avatar">
                <div
                  class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p class="font-medium">Updated profile information</p>
                <p class="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="avatar">
                <div
                  class="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p class="font-medium">Changed password</p>
                <p class="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="avatar">
                <div
                  class="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p class="font-medium">Scheduled system maintenance</p>
                <p class="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-sm btn-outline">View All Activity</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProfileStore } from "../../../stores/profileUser.store";

const profileUser = useProfileStore();
onMounted(async () => {
  if (!profileUser.userProfile) {
    const response = await profileUser.fetchProfile();
    console.log("profile", response);
  }
});
</script>
