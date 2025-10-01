window.addEventListener("DOMContentLoaded", () => {
    const progress = document.querySelector(".progress");
    const elem = document.querySelector(".progress-done");
    const cta = document.querySelector(".cta");
    const target = Number(elem.getAttribute("data-done")) || 100;
  
    let width = 0;
    const tick = setInterval(() => {
      if (width >= target) {
        clearInterval(tick);
        elem.style.width = "100%";
        elem.textContent = "100%";
  
        // brief hold at 100%, then fade out the bar
        setTimeout(() => {
          progress.classList.add("is-hidden");
  
          // after fade completes, remove from layout and reveal CTA
          progress.addEventListener(
            "transitionend",
            (e) => {
              if (e.propertyName === "opacity") {
                progress.style.display = "none";
                // show button (fade-in)
                requestAnimationFrame(() => cta.classList.add("show"));
              }
            },
            { once: true }
          );
        }, 300);
  
        return;
      }
      width++;
      elem.style.width = width + "%";
      elem.textContent = width + "%";
    }, 50);
  });
  