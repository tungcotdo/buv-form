var buv__slidesimple = new Swiper(".buv__slide--accommodation .buv__slidesimple", {
    slidesPerView: '1',
    spaceBetween: 10,
    loop: true,
    autoHeight: true,
    speed: 800,
    autoplay: {
        delay: 3000,
    },
    navigation: {
        nextEl: ".buv__slide--accommodation .custom-index-next",
        prevEl: ".buv__slide--accommodation .custom-index-prev",
    },
});

var buv__slidesimple = new Swiper(".buv__slide--facilities .buv__slidesimple", {
    slidesPerView: '1',
    spaceBetween: 10,
    loop: true,
    autoHeight: true,
    speed: 800,
    autoplay: {
        delay: 3000,
    },
    navigation: {
        nextEl: ".buv__slide--facilities .custom-index-next",
        prevEl: ".buv__slide--facilities .custom-index-prev",
    },
});


var gallery_slide = new Swiper(".buv__gallery .buv__slidegallery", {
    navigation: {
        nextEl: '.buv__gallery .swiper-button-next',
        prevEl: '.buv__gallery .swiper-button-prev',
    },
});