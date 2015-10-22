(function () {

  var main_nav = document.querySelector('.main-nav');
  var toggles = document.querySelectorAll('.main-nav__toggle');

  for (var i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener('tap', tapHandler);
  }

  function tapHandler(e) {
    e.preventDefault();
    main_nav.classList.toggle('main-nav--show');
  }

})();
