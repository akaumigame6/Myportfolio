class Slideshow {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.slide');
    this.prevBtn = container.querySelector('.prev');
    this.nextBtn = container.querySelector('.next');
    this.dotsContainer = container.querySelector('.dots');
    this.currentIndex = 0;
    this.timer = null;

    this.createDots();
    this.updateSlides();
    this.addEventListeners();
    this.startAutoSlide();
  }

  createDots() {
    this.dots = [];
    this.slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        this.currentIndex = index;
        this.updateSlides();
        this.resetTimer();
      });
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    });
  }

  updateSlides() {
    this.slides.forEach((slide, i) => {
      slide.style.display = i === this.currentIndex ? 'block' : 'none';
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  addEventListeners() {
    this.prevBtn.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.updateSlides();
      this.resetTimer();
    });

    this.nextBtn.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.updateSlides();
      this.resetTimer();
    });
  }

  startAutoSlide() {
    this.timer = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.updateSlides();
    }, 4000);
  }

  resetTimer() {
    clearInterval(this.timer);
    this.startAutoSlide();
  }
}

//Parrot
const parrot = document.getElementById('parrot');
let tapCount = 0;
let isBusy = false;

const animations = [
  'images/Parrot/まばたき.gif',
  'images/Parrot/首回し.gif',
  'images/Parrot/横揺れ.gif',
  'images/Parrot/縦揺れ.gif',
];

function playAction(gifPath) {
  if (isBusy) return;
  isBusy = true;

  parrot.src = gifPath;

  setTimeout(() => {
    parrot.src = 'images/Parrot/縦揺れ通常.gif'; // 元に戻す
    isBusy = false;
  }, 3000); // アニメ時間に応じて調整
}

function playAngry() {
  if (isBusy) return;
  isBusy = true;
  parrot.src = 'images/Parrot/いかり.gif';

  setTimeout(() => {
    parrot.src = 'images/Parrot/縦揺れ通常.gif';
    tapCount = 0;
    isBusy = false;
  }, 3000);
}

parrot.addEventListener('click', () => {
  if (isBusy) return;

  tapCount++;
  if (tapCount >= 5) {
    playAngry();
    return;
  }

  const anim = animations[Math.floor(Math.random() * animations.length)];
  playAction(anim);
});

// ページ内のすべてのスライドショーを初期化
document.addEventListener('DOMContentLoaded', () => {
  const slideshows = document.querySelectorAll('.slideshow');
  slideshows.forEach(slideshow => new Slideshow(slideshow));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const groupItems = entry.target.querySelectorAll('.fade-in-on-scroll');
        if (groupItems.length > 0) {
          groupItems.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('visible');
            }, index * 150); // 150msごとにずらす
          });
        } else {
          entry.target.classList.add('visible');
        }
      }
    });
  }, { threshold: 0.1 });

  // .fade-in-group を持つ要素を観察（グループ内に .fade-in-on-scroll がある前提）
  document.querySelectorAll('.fade-in-group').forEach(el => observer.observe(el));

  // .fade-in-on-scroll 単独要素も観察
  document.querySelectorAll('.fade-in-on-scroll:not(.fade-in-group *)').forEach(el => observer.observe(el));

  const icon = document.querySelector('.intro-icon');

  icon.addEventListener('click', () => {
    icon.classList.add('animate-hue');

    // 3秒後にクラスを削除して元に戻す
    setTimeout(() => {
      icon.classList.remove('animate-hue');
    }, 3000);
  });

});