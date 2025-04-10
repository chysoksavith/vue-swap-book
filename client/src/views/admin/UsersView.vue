<template>
  <div class="card bg-base-100 shadow col-span-1 lg:col-span-3">
    <div class="card-body">
      <div class="flex justify-between items-center">
        <h2 class="card-title">User</h2>
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
</template>
<script setup lang="ts"></script>
