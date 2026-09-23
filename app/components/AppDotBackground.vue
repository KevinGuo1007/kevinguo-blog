<script setup lang="ts">
const canvas = useTemplateRef<HTMLCanvasElement>("canvas");

const DOT_SPACING = 18;
const DOT_RADIUS = 0.9;
const WAVE_AMPLITUDE = 4;
const FRAME_INTERVAL = 1000 / 30;

let animationFrame = 0;
let lastFrameTime = 0;
let width = 0;
let height = 0;
let shellLeft = 0;
let shellRight = 0;
let reduceMotion: MediaQueryList | undefined;
let resizeObserver: ResizeObserver | undefined;

function fractionalPart(value: number) {
  return value - Math.floor(value);
}

function pointOpacity(x: number, y: number) {
  const random = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return 0.35 + fractionalPart(random) * 0.5;
}

function updateDimensions() {
  const element = canvas.value;
  if (!element) return;

  width = window.innerWidth;
  height = window.innerHeight;

  const shell = document.querySelector<HTMLElement>("[data-site-shell]");
  const shellRect = shell?.getBoundingClientRect();
  shellLeft = shellRect?.left ?? 0;
  shellRight = shellRect?.right ?? width;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  element.width = Math.round(width * pixelRatio);
  element.height = Math.round(height * pixelRatio);
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;

  const context = element.getContext("2d");
  context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function draw(time: number) {
  const element = canvas.value;
  const context = element?.getContext("2d");
  if (!element || !context) return;

  context.clearRect(0, 0, width, height);

  const hasLeftGutter = shellLeft > DOT_SPACING;
  const hasRightGutter = width - shellRight > DOT_SPACING;
  if (!hasLeftGutter && !hasRightGutter) return;

  const phase = time / 3600;
  const exclusionPadding = WAVE_AMPLITUDE + DOT_RADIUS + 1;
  context.fillStyle = getComputedStyle(element).color;

  for (let x = -DOT_SPACING / 2; x < width + DOT_SPACING; x += DOT_SPACING) {
    const isInLeftGutter = hasLeftGutter && x < shellLeft - exclusionPadding;
    const isInRightGutter =
      hasRightGutter && x > shellRight + exclusionPadding;

    if (!isInLeftGutter && !isInRightGutter) continue;

    for (
      let y = -DOT_SPACING / 2;
      y < height + DOT_SPACING;
      y += DOT_SPACING
    ) {
      const wave =
        Math.sin(y / 92 + phase) +
        Math.sin((x + y) / 168 - phase * 0.8) * 0.55;
      const crossWave =
        Math.cos(x / 118 - phase * 1.15) +
        Math.sin((x - y) / 214 + phase * 0.65) * 0.45;
      const offsetX = wave * WAVE_AMPLITUDE;
      const offsetY = crossWave * WAVE_AMPLITUDE;
      const pulse = 0.72 + Math.abs(Math.cos(wave + phase)) * 0.28;

      context.globalAlpha = pointOpacity(x, y) * pulse;
      context.beginPath();
      context.arc(
        x + offsetX,
        y + offsetY,
        DOT_RADIUS,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }

  context.globalAlpha = 1;
}

function animate(time: number) {
  if (time - lastFrameTime >= FRAME_INTERVAL) {
    draw(time);
    lastFrameTime = time;
  }

  animationFrame = window.requestAnimationFrame(animate);
}

function handleMotionPreference() {
  window.cancelAnimationFrame(animationFrame);
  lastFrameTime = 0;

  if (reduceMotion?.matches) {
    draw(0);
    return;
  }

  animationFrame = window.requestAnimationFrame(animate);
}

onMounted(async () => {
  await nextTick();
  updateDimensions();

  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.addEventListener("change", handleMotionPreference);

  const shell = document.querySelector<HTMLElement>("[data-site-shell]");
  if (shell) {
    resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      if (reduceMotion?.matches) draw(0);
    });
    resizeObserver.observe(shell);
  }

  window.addEventListener("resize", updateDimensions, { passive: true });
  handleMotionPreference();
});

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame);
  window.removeEventListener("resize", updateDimensions);
  reduceMotion?.removeEventListener("change", handleMotionPreference);
  resizeObserver?.disconnect();
});
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="site-dot-background pointer-events-none fixed inset-0"
  />
</template>

<style scoped>
.site-dot-background {
  color: var(--ui-border-accented);
}
</style>
