// Hover (desktop) / in-view (touch) play-pause for reel card loops.
export function initReelVideos(root: ParentNode = document) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.reel-media'));
  if (!cards.length) return;

  const isTouch = matchMedia('(hover: none)').matches;

  const play = (card: HTMLElement, video: HTMLVideoElement) => {
    card.classList.add('playing');
    video.play().catch(() => {});
  };
  const pause = (card: HTMLElement, video: HTMLVideoElement) => {
    card.classList.remove('playing');
    video.pause();
  };

  if (!isTouch) {
    cards.forEach((card) => {
      const video = card.querySelector<HTMLVideoElement>('video[data-reel-video]');
      if (!video) return;
      card.addEventListener('mouseenter', () => play(card, video));
      card.addEventListener('mouseleave', () => pause(card, video));
      card.addEventListener('focus', () => play(card, video));
      card.addEventListener('focusout', () => pause(card, video));
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement;
        const video = card.querySelector<HTMLVideoElement>('video[data-reel-video]');
        if (!video) return;
        if (entry.isIntersecting) play(card, video);
        else pause(card, video);
      });
    },
    { threshold: 0.6 }
  );
  cards.forEach((card) => observer.observe(card));
}
