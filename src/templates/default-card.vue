<template>
  <article class="card-shell">
    <div class="card-shell__glow"></div>
    <p class="card-shell__eyebrow">FRONTEND ENGINEER</p>
    <div class="card-shell__header">
      <img
        class="card-shell__avatar"
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
        alt="Developer avatar"
      />
      <div>
        <h1>{{ profile.name }}</h1>
        <p>{{ profile.role }}</p>
      </div>
    </div>

    <p class="card-shell__bio">{{ profile.bio }}</p>

    <ul class="card-shell__stats">
      <li v-for="item in stats" :key="item.label">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </li>
    </ul>

    <footer class="card-shell__footer">
      <span>{{ profile.location }}</span>
      <a :href="profile.website" target="_blank" rel="noreferrer">Portfolio ↗</a>
    </footer>
  </article>
</template>

<script setup lang="ts">
const profile = {
  name: 'Morgan Lee',
  role: 'Vue / Motion / Design Systems',
  bio: 'Focuses on interaction-rich product surfaces, component systems, and build-once reusable UI.',
  location: 'Shanghai · Remote Friendly',
  website: 'https://example.com',
}

const stats = [
  { label: 'Projects', value: '24' },
  { label: 'Years', value: '8' },
  { label: 'Open Source', value: '31' },
]
</script>

<style scoped>
.card-shell {
  --card-bg: #15253a;
  --card-fg: #f4f7fb;
  --card-accent: #f9b36a;
  --card-radius: 28px;
  --card-padding: 30px;
  --card-shadow-alpha: 0.26;
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 22px;
  padding: var(--card-padding);
  color: var(--card-fg);
  border-radius: var(--card-radius);
  background:
    radial-gradient(circle at top right, rgba(249, 179, 106, 0.24), transparent 34%),
    linear-gradient(155deg, color-mix(in srgb, var(--card-bg), white 6%) 0%, var(--card-bg) 72%);
  box-shadow: 0 26px 60px rgba(11, 18, 28, var(--card-shadow-alpha));
}

.card-shell__glow {
  position: absolute;
  inset: -30% auto auto 68%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--card-accent), white 30%);
  filter: blur(56px);
  opacity: 0.38;
}

.card-shell__eyebrow {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--card-accent);
}

.card-shell__header {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 16px;
  align-items: center;
}

.card-shell__header h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.02;
}

.card-shell__header p,
.card-shell__bio,
.card-shell__footer span {
  margin: 0;
  color: color-mix(in srgb, var(--card-fg), transparent 18%);
}

.card-shell__avatar {
  width: 78px;
  height: 78px;
  object-fit: cover;
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.18);
}

.card-shell__bio {
  position: relative;
  z-index: 1;
  font-size: 15px;
  line-height: 1.75;
}

.card-shell__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.card-shell__stats li {
  padding: 16px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
}

.card-shell__stats strong {
  display: block;
  font-size: 24px;
}

.card-shell__stats span {
  font-size: 12px;
  color: color-mix(in srgb, var(--card-fg), transparent 28%);
}

.card-shell__footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-shell__footer a {
  color: var(--card-accent);
  text-decoration: none;
  font-weight: 600;
}
</style>
