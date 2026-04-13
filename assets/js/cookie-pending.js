(function () {
  try {
    if (!localStorage.getItem("lt_cookie_consent")) {
      document.documentElement.classList.add("cookie-pending");
    }
  } catch (error) {
    // Ignore storage access issues in restricted environments.
  }
})();
