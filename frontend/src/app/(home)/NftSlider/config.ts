import { Pagination } from 'swiper/modules';
export const config = {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
        1800: {
            slidesPerView: 6,
            spaceBetween: 20,
        },
    },
    modules: [Pagination],
    className: 'mySwiper',
};