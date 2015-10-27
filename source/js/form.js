(function () {
  var els = document.querySelectorAll('.field-num');

  for (var i = 0; i < els.length; i++) {
    initNumberField(els[i]);
  }

  function getDataAttribute(node, name) {
    if (node.dataset !== undefined) {
      return node.dataset[name];
    } else {
      return node.getAttribute('data-' + name);
    }
  }

  var customEvent = document.createEvent("CustomEvent");
  customEvent.initCustomEvent('change-number', false, false, {});
  function initNumberField(el) {
    var input = el.querySelector('input');
    var minus = el.querySelector('.field-num__item--minus');
    var plus = el.querySelector('.field-num__item--plus');

    var input_max = Number(getDataAttribute(input, 'max')) || Number.MAX_VALUE;
    var input_min = Number(getDataAttribute(input, 'min')) || Number.MIN_VALUE;

    minus.addEventListener('click', function () {
      changeNumber(false);
    });
    plus.addEventListener('click', function () {
      changeNumber(true);
    });

    input.addEventListener('keypress', function (e) {
      var key = e.charCode || e.keyCode || 0;

      return (
      key == 8 || // backspace
      key == 9 || // tab
      key == 13 || // enter
      key == 46 || // del
      (key >= 35 && key <= 40) || // end, home, left arrow, up arrow, right arrow, down arrow
      (key >= 48 && key <= 57)) // numbers
        ? true : e.preventDefault();
    });

    input.addEventListener('change', function () {
      checkInput();
      input.dispatchEvent(customEvent);
    });

    function checkInput() {
      var val = Number(input.value);

      if (val < input_min) {
        input.value = input_min;
      } else if (val > input_max) {
        input.value = input_max;
      }
    }

    function changeNumber(operation) {
      var value = Number(input.value);
      if (isNaN(value)) {
        value = 0;
      }
      if (operation) {
        input.value = value + 1;
      } else {
        input.value = value - 1;
      }

      checkInput();
      input.dispatchEvent(customEvent);
    }
  }

  var form = document.querySelector('.form');
  if (form) {
    var imageSelector = form.querySelector('#file1');
    var ajaxImages = [];

    // Валидация формы
    var modal_failure = document.querySelector('.modal--failure');
    var modal_success = document.querySelector('.modal--success');

    var fieldsValidators = [
      {
        name: 'name',
        rules: 'required'
      },
      {
        name: 'surname',
        rules: 'required'
      },
      {
        name: 'date-coming',
        rules: 'required'
      }, {
        name: 'number-day',
        rules: 'required|integer'
      }
    ];
    var errors;
    new FormValidator(form, fieldsValidators, function (err) {
      // reset errors & modals
      var errorElements = document.querySelectorAll('.input--error');
      for (var i = 0; i < errorElements.length; i++) {
        errorElements[i].classList.remove('input--error');
      }
      closeModal();

      errors = err;
      if (err.length) {
        err.forEach(function (el) {
          el.element.classList.add('input--error');
        });
        modal_failure.classList.add("modal--show");
      }
    });

    // ajax отправка формы
    if ('FormData' in window) {
      function request(data, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'https://echo.htmlacademy.ru/adaptive?' + (new Date()).getTime());
        xhr.addEventListener('readystatechange', function () {
          if (xhr.readyState == 4) {
            fn(xhr.responseText);
          }
        });
        xhr.send(data);
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (errors.length) {
          return false;
        }

        var data = new FormData(form);

        ajaxImages.forEach(function (el) {
          data.append(imageSelector.name, el.file);
        });

        request(data, function (response) {
          modal_success.classList.add("modal--show");
          console.log(response);
          form.reset();
        });
      });
    }

    function closeModal() {
      if (modal_success.classList.contains("modal--show")) {
        modal_success.classList.remove("modal--show");
      }
      if (modal_failure.classList.contains("modal--show")) {
        modal_failure.classList.remove("modal--show");
      }
    }

    var btnEls = document.querySelectorAll('.btn--modal');
    for (var i = 0; i < btnEls.length; i++) {
      btnEls[i].addEventListener('click', closeModal);
    }

    window.addEventListener("keydown", function (event) {
      if (event.keyCode == 27) {
        closeModal();
      }
    });

    // preview фотографий
    if ('FileReader' in window) {
      var photoPreviews = form.querySelector('.form__photo-previews');

      var previewTemplate = document.querySelector('#preview-template').innerHTML;
      Mustache.parse(previewTemplate);

      function preview(file) {
        if (file.type.match(/image.*/)) {
          var reader = new FileReader();

          reader.addEventListener('load', function (event) {
            var htmlPreview = Mustache.render(previewTemplate, {
              'src': event.target.result,
              'alt': file.name
            });

            var div = document.createElement('div');
            div.classList.add('form__photo-preview');
            div.innerHTML = htmlPreview;
            div.querySelector('.form__photo-preview-delete').addEventListener('click', function (e) {
              e.preventDefault();
              removePreview(div);
            });

            photoPreviews.appendChild(div);

            ajaxImages.push({
              file: file,
              div: div
            })
          });

          reader.readAsDataURL(file);
        }
      }

      function removePreview(div) {
        ajaxImages = ajaxImages.filter(function (element) {
          return element.div != div;
        });

        div.parentNode.removeChild(div);
      }

      imageSelector.addEventListener('change', function () {
        var files = this.files;

        for (var i = 0; i < files.length; i++) {
          preview(files[i]);
        }
        this.value = '';
      });

    }

    // Путешествиники
    var travelerInput = document.querySelector('#number-traveler');
    var travelerList = document.querySelector('.form__traveler-list');
    var travelerTemplate = document.querySelector('#traveler-template').innerHTML;
    Mustache.parse(travelerTemplate);

    var travelersLength = 0;

    travelerInput.addEventListener('change-number', function () {
      var length = Number(this.value);

      if (travelersLength > length) {
        for (var i = length; i < travelersLength; i++) {
          var li = document.querySelector('#traveler_' + i);
          li.parentNode.removeChild(li);
        }
      } else {
        for (var i = travelersLength; i < length; i++) {
          var htmlPreview = Mustache.render(travelerTemplate, {key: i});

          var li = document.createElement('li');
          li.id = 'traveler_' + i;
          li.classList.add('form__traveler');
          li.innerHTML = htmlPreview;

          travelerList.appendChild(li);
        }
      }

      travelersLength = length;
    });

    travelerInput.dispatchEvent(customEvent); // init

    // Даты
    var date_coming = document.querySelector('#date-coming');
    var date_leave = document.querySelector('#date-leave');
    var number_day = document.querySelector('#number-day');
    moment.locale('ru');

    var picker = new Pikaday({
      field: date_coming,
      format: 'LL',
      onSelect: changeLeaveDate
    });
    number_day.addEventListener('change-number', changeLeaveDate);

    function changeLeaveDate() {
      var start = picker.getMoment();
      var days = Number(number_day.value);
      var rawValue = date_coming.value;
      if (rawValue != '' && days) {
        date_leave.value = start.add(days, 'd').format('LL');
      } else {
        date_leave.value = '';
      }
    }

  }

})();
