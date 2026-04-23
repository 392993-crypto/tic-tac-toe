// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            // Prevent the page from refreshing
            e.preventDefault();

            // Grab the values from the input fields
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                // Send the data to your backend API
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful! You can now log in.');
                    // Redirect the user to the login page
                    window.location.href = '/login.html';
                } else {
                    // Handle errors (e.g., username already exists)
                    alert(`Registration failed: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred connecting to the server.');
            }
        });
    }
});