<template>
  <article class="intro-card">
    <div class="intro-card__media">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
        alt="Profile portrait"
      />
    </div>
    <div class="intro-card__body">
      <p class="intro-card__eyebrow">PERSONAL INTRO</p>
      <h1>{{ profile.name }}</h1>
      <p class="intro-card__role">{{ profile.role }}</p>
      <p class="intro-card__bio">{{ profile.bio }}</p>

      <dl class="intro-card__meta">
        <div>
          <dt>Location</dt>
          <dd>{{ profile.location }}</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>{{ profile.focus }}</dd>
        </div>
      </dl>

      <div class="intro-card__tags">
        <span v-for="tag in profile.tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const profile = {
  name: 'Avery Chen',
  role: 'Product Designer & Frontend Engineer',
  bio: 'Builds high-clarity interfaces with motion, content hierarchy, and strong component discipline across web products.',
  location: 'Shanghai / Remote',
  focus: 'Design systems, interaction design, Vue engineering',
  tags: ['Vue 3', 'Design Tokens', 'Motion', 'Accessibility'],
}
</script>

<style scoped>
.intro-card {
  --card-bg: #102030;
  --card-fg: #eff6fb;
  --card-accent: #f0a85b;
  --card-radius: 30px;
  --card-padding: 28px;
  --card-shadow-alpha: 0.28;
  display: grid;
  grid-template-columns: 172px minmax(0, 1fr);
  gap: 24px;
  overflow: hidden;
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  color: var(--card-fg);
  background:
    radial-gradient(circle at top left, rgba(240, 168, 91, 0.18), transparent 30%),
    linear-gradient(135deg, color-mix(in srgb, var(--card-bg), white 5%) 0%, var(--card-bg) 100%);
  box-shadow: 0 26px 56px rgba(10, 18, 27, var(--card-shadow-alpha));
}

.intro-card__media img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  border-radius: 24px;
}

.intro-card__body {
  display: grid;
  gap: 14px;
  align-content: start;
}

.intro-card__eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--card-accent);
}

.intro-card__body h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.02;
}

.intro-card__role,
.intro-card__bio,
.intro-card__meta dt {
  margin: 0;
  color: color-mix(in srgb, var(--card-fg), transparent 18%);
}

.intro-card__bio {
  font-size: 15px;
  line-height: 1.75;
}

.intro-card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.intro-card__meta div {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
}

.intro-card__meta dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.intro-card__meta dd {
  margin: 8px 0 0;
  font-size: 14px;
}

.intro-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.intro-card__tags span {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--card-accent);
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 720px) {
  .intro-card {
    grid-template-columns: 1fr;
  }

  .intro-card__media img {
    min-height: 220px;
  }
}
</style>
