document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (!track || !nextBtn || !prevBtn) return;

  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  let currentIndex = 1;
  let isTransitioning = false;

  track.style.transition = 'none';
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  function updateCarousel() {
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;

  
    if (currentIndex === 0) {
      track.style.transition = 'none';
      currentIndex = slides.length - 2; 
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    
    if (currentIndex === slides.length - 1) {
      track.style.transition = 'none';
      currentIndex = 1; 
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);

  for (const field of ['name', 'email', 'message']) {
    const output = document.getElementById(`submitted-${field}`);
    if (output) {
      output.textContent = urlParams.get(field) || '';
    }
  }
});