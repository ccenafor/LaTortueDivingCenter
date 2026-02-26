document.addEventListener('DOMContentLoaded', function() {
  var widgets = document.querySelectorAll('[data-bookingcom-widget]');
  if (!widgets.length) return;

  var defaultBaseUrl = 'https://www.booking.com/hotel/ph/la-tortue-diving-center.en-gb.html';

  function toISODate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function parseISODate(value) {
    if (!value) return null;
    var parts = value.split('-');
    if (parts.length !== 3) return null;
    var year = Number(parts[0]);
    var month = Number(parts[1]) - 1;
    var day = Number(parts[2]);
    var date = new Date(year, month, day);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  }

  function addDays(date, days) {
    var out = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    out.setDate(out.getDate() + days);
    return out;
  }

  function nightsBetween(startDate, endDate) {
    var msInDay = 24 * 60 * 60 * 1000;
    var startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    var endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.round((endUTC - startUTC) / msInDay);
  }

  widgets.forEach(function(widget) {
    var checkinInput = widget.querySelector('[data-booking-checkin]');
    var checkoutInput = widget.querySelector('[data-booking-checkout]');
    var stayTypeInput = widget.querySelector('[data-stay-type]');
    var submitLink = widget.querySelector('[data-booking-submit]');
    var hint = widget.querySelector('[data-booking-hint]');

    if (!checkinInput || !checkoutInput || !submitLink) return;

    var baseUrl = widget.getAttribute('data-booking-base') || defaultBaseUrl;
    var minNightsDefault = Number(widget.getAttribute('data-min-nights') || '2');
    var minNightsDorm = Number(widget.getAttribute('data-min-nights-dormitory') || '1');
    var noteRoom = widget.getAttribute('data-note-room') || '';
    var noteDorm = widget.hasAttribute('data-note-dormitory')
      ? (widget.getAttribute('data-note-dormitory') || '')
      : noteRoom;
    var noteErrorPrefix = widget.getAttribute('data-note-error-prefix') || 'Minimum stay is';
    var noteErrorSuffix = widget.getAttribute('data-note-error-suffix') || 'night(s) for this stay type.';
    var noteMissingCheckin = widget.getAttribute('data-note-missing-checkin') || 'Please select a check-in date.';
    var noteMissingCheckout = widget.getAttribute('data-note-missing-checkout') || 'Please select a check-out date.';
    var today = new Date();
    var todayIso = toISODate(today);

    checkinInput.min = todayIso;
    checkoutInput.min = todayIso;

    [checkinInput, checkoutInput].forEach(function(input) {
      input.addEventListener('click', function() {
        if (typeof input.showPicker === 'function') {
          try {
            input.showPicker();
          } catch (error) {
            // Keep default browser date input behavior if showPicker is blocked.
          }
        }
      });
    });

    function currentMinNights() {
      if (!stayTypeInput) return minNightsDefault;
      return stayTypeInput.value === 'dormitory' ? minNightsDorm : minNightsDefault;
    }

    function updateHintMessage(customMessage) {
      if (!hint) return;
      var message = '';
      var isError = false;

      if (customMessage) {
        message = customMessage;
        isError = true;
      } else {
        var roomMode = !stayTypeInput || stayTypeInput.value !== 'dormitory';
        message = roomMode ? noteRoom : noteDorm;
      }

      hint.textContent = message;
      hint.classList.toggle('bookingcom-note-error', isError && !!message);
      hint.hidden = !message.trim();
    }

    function buildBookingUrl() {
      var url = new URL(baseUrl);
      var checkin = checkinInput.value;
      var checkout = checkoutInput.value;
      if (checkin) url.searchParams.set('checkin', checkin);
      if (checkout) url.searchParams.set('checkout', checkout);
      url.searchParams.set('group_adults', '2');
      url.searchParams.set('no_rooms', '1');
      url.searchParams.set('group_children', '0');
      return url.toString();
    }

    function syncCheckoutMin() {
      var minNights = currentMinNights();
      var checkinDate = parseISODate(checkinInput.value);
      var minCheckoutDate = checkinDate ? addDays(checkinDate, minNights) : today;
      var minCheckoutIso = toISODate(minCheckoutDate);
      checkoutInput.min = minCheckoutIso;

      var checkoutDate = parseISODate(checkoutInput.value);
      if (checkoutDate && checkoutDate < minCheckoutDate) {
        checkoutInput.value = minCheckoutIso;
      }
    }

    function updateLink() {
      submitLink.href = buildBookingUrl();
      updateHintMessage('');
    }

    function validateBeforeRedirect(event) {
      var checkinDate = parseISODate(checkinInput.value);
      var checkoutDate = parseISODate(checkoutInput.value);
      var minNights = currentMinNights();

      if (!checkinDate) {
        event.preventDefault();
        updateHintMessage(noteMissingCheckin);
        checkinInput.focus();
        return;
      }

      if (!checkoutDate) {
        event.preventDefault();
        updateHintMessage(noteMissingCheckout);
        checkoutInput.focus();
        return;
      }

      if (checkoutDate <= checkinDate || nightsBetween(checkinDate, checkoutDate) < minNights) {
        event.preventDefault();
        updateHintMessage(noteErrorPrefix + ' ' + minNights + ' ' + noteErrorSuffix);
        checkoutInput.focus();
      }
    }

    checkinInput.addEventListener('change', function() {
      syncCheckoutMin();
      updateLink();
    });

    checkoutInput.addEventListener('change', function() {
      syncCheckoutMin();
      updateLink();
    });

    if (stayTypeInput) {
      stayTypeInput.addEventListener('change', function() {
        syncCheckoutMin();
        updateLink();
      });
    }

    submitLink.addEventListener('click', validateBeforeRedirect);

    syncCheckoutMin();
    updateLink();
  });
});
