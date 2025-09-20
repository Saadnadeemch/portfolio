document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const submitButton = form.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;

    // Make sure EmailJS SDK is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded. Please include the EmailJS script in your HTML.');
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents page reload

        // Get form values
        const name = form.querySelector("input[placeholder='Enter name']").value.trim();
        const email = form.querySelector("input[placeholder='Enter email']").value.trim();
        const message = form.querySelector("textarea[placeholder='Write your Message']").value.trim();

        // Validate form
        if (!name || !email || !message) {
            showToast("Please fill in all fields!", "error");
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            showToast("Please enter a valid email address!", "error");
            return;
        }

        // Show loading spinner in button
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        const formData = {
            from_name: name,
            from_email: email,
            message: message
        };

        // Send email using EmailJS
        emailjs.send("service_0eew8gx", "template_5x1sulc", formData, "x-eGcUogh6W3HRDax")
            .then(() => {
                showToast("Message sent successfully!", "success");
                form.reset();
                // Restore button text
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                showToast("Failed to send message!", "error");
                // Restore button text
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
    });

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Improved toast notification function
    function showToast(message, type) {
        // Remove any existing toasts first
        const existingToasts = document.querySelectorAll('.toaster');
        existingToasts.forEach(toast => document.body.removeChild(toast));
        
        // Create toast element
        const toaster = document.createElement("div");
        toaster.className = `toaster ${type}`;
        
        // Create icon based on type
        const icon = document.createElement("i");
        if (type === "success") {
            icon.className = "fas fa-check-circle";
        } else if (type === "error") {
            icon.className = "fas fa-exclamation-circle";
        }
        
        // Create message text
        const messageText = document.createElement("span");
        messageText.textContent = message;
        
        // Add icon and message to toast
        toaster.appendChild(icon);
        toaster.appendChild(messageText);
        
        // Calculate position to show below the form
        const formRect = form.getBoundingClientRect();
        toaster.style.position = "absolute";
        toaster.style.left = `${formRect.left + (formRect.width / 2) - 150}px`; // Center toast
        toaster.style.top = `${formRect.bottom - 20}px`; // Position below form
        
        // Add toast to page
        document.body.appendChild(toaster);
        
        // Animate in
        setTimeout(() => {
            toaster.style.opacity = "1";
            toaster.style.transform = "translateY(0)";
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            toaster.style.opacity = "0";
            toaster.style.transform = "translateY(-10px)";
            setTimeout(() => {
                if (document.body.contains(toaster)) {
                    document.body.removeChild(toaster);
                }
            }, 300);
        }, 3000);
    }
});