<script setup lang="ts">
import { computed } from 'vue'

import type { StyleControls } from '@/utils/defaultCard'

const props = defineProps<{
  controls: StyleControls
}>()

const emit = defineEmits<{
  change: [value: StyleControls]
  reset: []
}>()

const shadowOpacity = computed(() => Math.round(props.controls.shadowAlpha * 100))

function patch<K extends keyof StyleControls>(key: K, value: StyleControls[K]) {
  emit('change', {
    ...props.controls,
    [key]: value,
  })
}
</script>

<template>
  <div class="style-panel">
    <div class="style-panel__group">
      <label>
        <span>背景色</span>
        <input
          :value="controls.backgroundColor"
          type="color"
          @input="patch('backgroundColor', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        <span>文字色</span>
        <input
          :value="controls.textColor"
          type="color"
          @input="patch('textColor', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        <span>强调色</span>
        <input
          :value="controls.accentColor"
          type="color"
          @input="patch('accentColor', ($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>

    <div class="style-panel__sliders">
      <label>
        <div>
          <span>圆角</span>
          <strong>{{ controls.radius }}px</strong>
        </div>
        <input
          :value="controls.radius"
          type="range"
          min="8"
          max="48"
          step="1"
          @input="patch('radius', Number(($event.target as HTMLInputElement).value))"
        />
      </label>

      <label>
        <div>
          <span>内边距</span>
          <strong>{{ controls.padding }}px</strong>
        </div>
        <input
          :value="controls.padding"
          type="range"
          min="16"
          max="48"
          step="1"
          @input="patch('padding', Number(($event.target as HTMLInputElement).value))"
        />
      </label>

      <label>
        <div>
          <span>阴影透明度</span>
          <strong>{{ shadowOpacity }}%</strong>
        </div>
        <input
          :value="controls.shadowAlpha"
          type="range"
          min="0.08"
          max="0.38"
          step="0.01"
          @input="patch('shadowAlpha', Number(($event.target as HTMLInputElement).value))"
        />
      </label>
    </div>

    <button class="style-panel__reset" type="button" @click="emit('reset')">重置样式</button>
  </div>
</template>

<style scoped>
.style-panel {
  display: grid;
  gap: 20px;
  height: 100%;
  align-content: start;
}

.style-panel__group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.style-panel__group label,
.style-panel__sliders label {
  display: grid;
  gap: 8px;
}

.style-panel__group span,
.style-panel__sliders span {
  font-size: 12px;
  color: #66746d;
}

.style-panel__group input[type='color'] {
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.style-panel__sliders {
  display: grid;
  gap: 16px;
}

.style-panel__sliders div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.style-panel__sliders strong {
  font-size: 13px;
  color: #1e2c24;
}

.style-panel__sliders input[type='range'] {
  width: 100%;
  accent-color: #cc7d4a;
}

.style-panel__reset {
  justify-self: start;
  padding: 10px 14px;
  border: none;
  border-radius: 999px;
  background: #152018;
  color: #eff7f2;
  font: inherit;
  cursor: pointer;
}

@media (max-width: 720px) {
  .style-panel__group {
    grid-template-columns: 1fr;
  }
}
</style>
