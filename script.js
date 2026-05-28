(function () {
  const videos = document.querySelectorAll(".bg-video");

  videos.forEach((video) => {
    let rafId = null;
    let fadingOut = false;
    let timeoutId = null;

    const FADE_MS = 500;
    const FADE_OUT_LEAD = 0.55;

    function fadeTo(target, duration = FADE_MS) {
      if (rafId) cancelAnimationFrame(rafId);

      const startOpacity = parseFloat(video.style.opacity || "0") || 0;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = startOpacity + (target - startOpacity) * eased;

        video.style.opacity = String(value);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function startVideo() {
      video.style.opacity = "0";
      video.play().catch(() => {});
      fadeTo(1);
    }

    video.addEventListener("loadeddata", startVideo);

    video.addEventListener("timeupdate", () => {
      if (!video.duration || Number.isNaN(video.duration)) return;

      const remaining = video.duration - video.currentTime;

      if (!fadingOut && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOut = true;
        fadeTo(0);
      }
    });

    video.addEventListener("ended", () => {
      video.style.opacity = "0";

      timeoutId = setTimeout(() => {
        video.currentTime = 0;
        fadingOut = false;
        video.play().catch(() => {});
        fadeTo(1);
      }, 100);
    });

    if (video.readyState >= 2) {
      startVideo();
    }
  });

  const revealItems = document.querySelectorAll(
    ".hero-content > *, .section-head, .glass-card, .tool-card, .pdf-copy, .phone-mock, .launch-grid a, .support-box"
  );

  revealItems.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => observer.observe(el));
})();
