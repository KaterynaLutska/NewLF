const rootMargin = window.matchMedia('(max-width: 992px)').matches ? '-100px 0px' : '-200px 0px';
const sections = document.querySelectorAll('.shopify-section');
sections.forEach((section) => {
    const obs = new IntersectionObserver((entries, observer) => {
        if(entries[0].isIntersecting) {
            section.classList.add('shopify-section--reveal');
            observer.unobserve(section);
        }
    }, {
        rootMargin,
        root: null,
        threshold: 0
    })
    obs.observe(section);
})
