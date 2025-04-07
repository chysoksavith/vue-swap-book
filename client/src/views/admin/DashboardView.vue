<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div class="stat-title">Total Revenue</div>
          <div class="stat-value text-primary">$25.6K</div>
          <div class="stat-desc">21% more than last month</div>
        </div>
      </div>

      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div class="stat-title">New Users</div>
          <div class="stat-value text-secondary">2,345</div>
          <div class="stat-desc">13% more than last month</div>
        </div>
      </div>

      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div class="stat-title">Total Sales</div>
          <div class="stat-value text-accent">1,234</div>
          <div class="stat-desc">8% more than last month</div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="card bg-base-100 shadow col-span-1 md:col-span-2">
        <div class="card-body">
          <h2 class="card-title">Revenue Overview</h2>
          <div
            class="h-80 bg-base-200 rounded flex items-center justify-center"
          >
            <span class="text-lg opacity-70">Chart will be displayed here</span>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Recent Activities</h2>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-start gap-3">
              <div class="avatar">
                <div class="w-10 rounded-full bg-neutral text-neutral-content">
                  <span>U{{ i }}</span>
                </div>
              </div>
              <div>
                <h3 class="font-medium">User {{ i }} performed action</h3>
                <p class="text-sm opacity-70">2 hours ago</p>
              </div>
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-sm btn-primary">View All</button>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card bg-base-100 shadow col-span-1 lg:col-span-3">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <h2 class="card-title">Recent Orders</h2>
            <button class="btn btn-sm btn-primary">Export</button>
          </div>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 5" :key="i">
                  <td>#ORD-00{{ i }}</td>
                  <td>Customer {{ i }}</td>
                  <td>2023-06-{{ 10 + i }}</td>
                  <td>${{ 100 * i }}</td>
                  <td>
                    <span
                      class="badge badge-sm"
                      :class="{
                        'badge-success': i % 2 === 0,
                        'badge-warning': i % 2 !== 0,
                      }"
                    >
                      {{ i % 2 === 0 ? "Completed" : "Pending" }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-xs btn-ghost">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
</script>
