function tickerSlider() {
  let tickerSlideshows = document.querySelectorAll('.ticker-slideshow');
  console.log(tickerSlideshows)
  tickerSlideshows.forEach((element) => {
    let pauseOnHover = element.getAttribute('data-pause-on-hover');
    //
    //   Variables
    //
    //////////////////////////////////////////////////////////////////////

    // Play with this value to change the speed
    let tickerSpeed = 1;

    let tickerFlickity = null;
    let isPaused = false;
    let slideshowEl = element;

    if (slideshowEl != null) {
      //
      //   Functions
      //
      //////////////////////////////////////////////////////////////////////

      let update = () => {
        if (isPaused) return;
        if (tickerFlickity.slides) {
          tickerFlickity.x = (tickerFlickity.x - tickerSpeed) % tickerFlickity.slideableWidth;
          tickerFlickity.selectedIndex = tickerFlickity.dragEndRestingSelect();
          tickerFlickity.updateSelectedSlide();
          tickerFlickity.settle(tickerFlickity.x);
        }
        window.requestAnimationFrame(update);
      };

      let pause = () => {
        isPaused = true;
      };

      let play = () => {
        if (isPaused) {
          isPaused = false;
          window.requestAnimationFrame(update);
        }
      };


      //
      //   Create Flickity
      //
      //////////////////////////////////////////////////////////////////////

      tickerFlickity = new Flickity(slideshowEl, {
        autoPlay: false,
        prevNextButtons: false,
        pageDots: false,
        draggable: true,
        wrapAround: true,
        selectedAttraction: 0.015,
        friction: 0.25
      });
      tickerFlickity.x = 0;


      if (pauseOnHover == 'true') {
        //
        //   Add Event Listeners
        //
        //////////////////////////////////////////////////////////////////////

        slideshowEl.addEventListener('mouseenter', pause, false);
        slideshowEl.addEventListener('focusin', pause, false);
        slideshowEl.addEventListener('mouseleave', play, false);
        slideshowEl.addEventListener('focusout', play, false);

        tickerFlickity.on('dragStart', () => {
                                isPaused = true;
                                });
      }


      //
      //   Start Ticker
      //
      //////////////////////////////////////////////////////////////////////

      update();
    }
  });
};


	tickerSlider()
