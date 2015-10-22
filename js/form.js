(function () {
  var els = document.querySelectorAll('.field-num');

  for (var i = 0; i < els.length; i++) {
    initNumberField(els[i]);
  }

  function initNumberField(el) {
    var input = el.querySelector('input');
    var minus = el.querySelector('.field-num__item--minus');
    var plus = el.querySelector('.field-num__item--plus');

    minus.addEventListener('tap', function () {
      changeNumber(false);
    });
    plus.addEventListener('tap', function () {
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

    var customEvent = new CustomEvent('change-number');
    input.addEventListener('change', function (e) {
      checkInput();
      input.dispatchEvent(customEvent);
    });

    function checkInput() {
      if (input.value < 0) {
        input.value = 0;
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
  var imageSelector = form.querySelector('#file1');
  var ajaxImages = [];

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

      var data = new FormData(form);

      ajaxImages.forEach(function (el) {
        data.append(imageSelector.name, el.file);
      });

      request(data, function (response) {
        console.log(response);
      });
    });
  }

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
          div.querySelector('.form__photo-preview-delete').addEventListener('tap', function (e) {
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

  travelerInput.addEventListener('change-number', function (e) {
    var length = Number(this.value);
    if (length > 10) {
      length = 10;
      this.value = 10;
    }

    if (travelersLength > length) {
      for(var i = length; i < travelersLength; i++) {
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

})();
