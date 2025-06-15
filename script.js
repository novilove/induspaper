document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleButton");
  const imageContainer = document.getElementById("imageContainer");
  const formContainer = document.getElementById("formContainer");
  const thankYouContainer = document.getElementById("thankYouContainer");
  const quotationForm = document.getElementById("quotationForm");

  // --- Handle Button Click (Image to Form) ---
  toggleButton.addEventListener("click", () => {
    // Only transition if currently on the image or thank you screen
    const isImageActive = imageContainer.classList.contains("active");
    const isThankYouActive = thankYouContainer.classList.contains("active");

    if (isImageActive) {
      // If image is active, transition to form
      formContainer.classList.add("active");
      imageContainer.classList.remove("active");
      // Optional: Hide the button after the first transition
      // toggleButton.style.display = 'none';
    } else if (isThankYouActive) {
      // Optional: If thank you is active, transition back to form (or image if preferred)
      // For this request, we'll assume clicking the button again from thank you
      // *could* go back to the form, but the primary flow is submit -> thank you.
      // Let's keep the button hidden after form appears for this specific request flow.
    }
  });

  // --- Handle Form Submission (Form to Thank You and Send Data) ---
  quotationForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = new FormData(quotationForm);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    console.log("Form data to send:", jsonData); // Log data before sending

    // --- Send Data to URL ---
    const targetUrl = "YOUR_BACKEND_URL_HERE"; // <<< REPLACE WITH YOUR ACTUAL URL

    fetch(targetUrl, {
      method: "POST", // Or 'PUT', depending on your API
      headers: {
        "Content-Type": "application/json",
        // Add any other headers your API requires (e.g., API key)
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle HTTP errors
          console.error(`HTTP error! status: ${response.status}`);
          // Optionally, display an error message to the user
          // alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
          // return Promise.reject('Server responded with non-OK status');
        }
        return response.json(); // Or response.text() if your server doesn't return JSON
      })
      .then((data) => {
        console.log("Success:", data);
        // Handle successful response (e.g., show a success message, though we already transition)

        // --- Trigger Transition to Thank You Message ---
        formContainer.classList.remove("active");
        thankYouContainer.classList.add("active");

        // Optional: Reset the form after successful submission
        // quotationForm.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle network errors or errors from the .then block
        // Optionally, display an error message to the user
        // alert('Ocurrió un error de red o del servidor. Por favor, inténtalo más tarde.');

        // Even if there's an error sending, you might still want to show the thank you message
        // depending on your desired user experience. If the backend is critical,
        // you might prevent the transition here and show an error instead.
        // For this example, we'll transition even on error for simplicity, but you should
        // consider the implications. Let's keep the transition to thank you for now.
        formContainer.classList.remove("active");
        thankYouContainer.classList.add("active");
      });
  });
});
