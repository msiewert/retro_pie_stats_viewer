<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :items-per-page="25"
      class="elevation-1"
    >
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PlayItem } from '../services/api'

defineProps<{
  items: PlayItem[]
}>()

const search = ref('')

const headers = [
  { title: 'Action', key: 'action', sortable: true },
  { title: 'Game', key: 'game', sortable: true },
  { title: 'Emulator', key: 'emulator', sortable: true },
  { title: 'Timestamp', key: 'timestamp', sortable: true },
]
</script>