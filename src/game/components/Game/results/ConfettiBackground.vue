<template>
  <div class="confetti-container">
    <div
      v-for="(particle, index) in particles"
      :key="index"
      class="confetti-particle"
      :style="{
        left: particle.x + '%',
        '--duration': particle.duration + 'ms',
        '--delay': particle.delay + 'ms',
        '--color': particle.color,
        '--angle': particle.angle + 'deg',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const particles = ref<
  Array<{
    x: number
    duration: number
    delay: number
    color: string
    angle: number
  }>
>([])

const colors = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#96ceb4',
  '#ffeaa7',
  '#dfe6e9',
  '#fd79a8',
  '#fdcb6e',
  '#6c5ce7',
]

const generateParticles = () => {
  const newParticles = []
  for (let i = 0; i < 40; i++) {
    newParticles.push({
      x: Math.random() * 100,
      duration: 2000 + Math.random() * 1000,
      delay: Math.random() * 500,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
    })
  }
  particles.value = newParticles as any

  // Clear particles after animation
  setTimeout(() => {
    particles.value = []
  }, 3500)
}

onMounted(() => {
  generateParticles()
})
</script>

<style scoped>
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 99;
}

.confetti-particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--color);
  border-radius: 50%;
  top: -10px;
  animation: fall var(--duration) linear var(--delay) forwards;
  opacity: 0.8;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(var(--angle)) translateX(50px);
    opacity: 0;
  }
}
</style>
