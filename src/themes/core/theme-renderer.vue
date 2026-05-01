<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileCardData } from '@/types/profile-card'
import { getProfileCardTheme } from './theme-registry'

const props = defineProps<{
  data: ProfileCardData
  themeId: string
  exportMode?: boolean
}>()

const theme = computed(() => getProfileCardTheme(props.themeId))
</script>

<template>
  <component :is="theme.component" :data="data" :export-mode="exportMode" />
</template>
