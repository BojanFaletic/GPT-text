
// on page load
document.addEventListener('DOMContentLoaded', function () {
    // initialize storage
    permanent_init();
    temporary_init();

    login_menu();
});


function registration_menu() {
    fetch('pages/registration.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("app").innerHTML = data;
        });
}

function login_menu() {
    fetch('pages/login.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("app").innerHTML = data;

            // add event listener to password field
            document.getElementById('password').addEventListener('keyup', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    on_login_button();
                }
            });

            // initiate all existing accounts
            generate_accounts();
        });
}

function pdf_menu() {
    fetch('pages/pdf.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("app").innerHTML = data;
        });
}

function chat_menu() {
    fetch('pages/chat.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("app").innerHTML = data;
        });

    document.getElementById('message').addEventListener('keyup', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            on_send_button();
        }
    });
}