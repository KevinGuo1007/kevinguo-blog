function getTransitionOrigin(event?: Event) {
  if (
    event instanceof MouseEvent &&
    (event.clientX !== 0 || event.clientY !== 0)
  ) {
    return { x: event.clientX, y: event.clientY };
  }

  const target =
    event?.currentTarget instanceof Element
      ? event.currentTarget
      : event?.target instanceof Element
        ? event.target
        : document.activeElement;

  if (target instanceof Element) {
    const { left, top, width, height } = target.getBoundingClientRect();
    return { x: left + width / 2, y: top + height / 2 };
  }

  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export function useColorModeTransition() {
  const colorMode = useColorMode();
  const isDark = computed(() => colorMode.value === "dark");

  function toggleColorMode() {
    colorMode.preference = isDark.value ? "light" : "dark";
  }

  function startViewTransition(event?: Event) {
    if (!document.startViewTransition) {
      toggleColorMode();
      return;
    }

    const { x, y } = getTransitionOrigin(event);
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      toggleColorMode();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: "cubic-bezier(.76,.32,.29,.99)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return {
    isDark,
    startViewTransition,
  };
}
