document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('.auth-form');
    if (!form) {
        alert('Form not found!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        var username = document.getElementById('username').value;
        localStorage.setItem('username', username);
    });
});