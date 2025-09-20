document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitButton = form.querySelector("button[type='submit']");
  const toastContainer = document.getElementById("toastContainer");
  const originalButtonText = submitButton.innerHTML;

  if (typeof emailjs === "undefined") {
    console.error("EmailJS SDK not loaded.");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.querySelector("input[name='name']").value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const message = form.querySelector("textarea[name='message']").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address!", "error");
      return;
    }

    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    const formData = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs
      .send("service_0eew8gx", "template_5x1sulc", formData, "x-eGcUogh6W3HRDax")
      .then(() => {
        showToast("Message sent successfully!", "success");
        form.reset();
        resetButton();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        showToast("Failed to send message!", "error");
        resetButton();
      });
  });

  function resetButton() {
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ✅ Toast function
  function showToast(message, type) {
    toastContainer.innerHTML = ""; // clear old

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
});
