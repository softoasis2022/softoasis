
const mainVisualBg = document.querySelector(".main-visual-bg");
const playStopBtn = document.querySelector(".play-stop-btn");

function changeBackground(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const activeImage = activeSlide.querySelector(".hero-image");

    if (activeImage) {
        mainVisualBg.style.backgroundImage = `url("${activeImage.src}")`;
    }
}

const swHero = new Swiper(".sw-hero", {
    speed: 1000,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".hero-next-btn",
        prevEl: ".hero-prev-btn",
    },
    on: {
        init: function (swiper) {
            changeBackground(swiper);
        },
        slideChangeTransitionStart: function (swiper) {
            changeBackground(swiper);
        },
    },
});

playStopBtn.addEventListener("click", () => {
    if (swHero.autoplay.running) {
        swHero.autoplay.stop();
        playStopBtn.classList.add("paused");
        playStopBtn.setAttribute("aria-label", "자동재생 시작");
    } else {
        swHero.autoplay.start();
        playStopBtn.classList.remove("paused");
        playStopBtn.setAttribute("aria-label", "자동재생 정지");
    }
});