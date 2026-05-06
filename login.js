document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('.auth-form');
    if (!form) {
        alert('Form not found!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        var username = formData.get('username');
        var password = formData.get('password');
        
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(function(response) {
            if (!response.ok) {
                return response.text().then(function(text) {
                    throw new Error(text || 'Login failed');
                });
            }
            return response.json();
        })
        .then(function(result) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', result.username);
            window.location.href = '/game.html';
        })
        .catch(function(error) {
            alert('Login error: ' + error.message);
        });
    });
});