
// on page load
document.addEventListener('DOMContentLoaded', function () {
    // initialize storage
    permanent_init();
    temporary_init();

    console.log("App loaded");
    login_page();
});


function login_page(){
    fetch('pages/first_page.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu").innerHTML = data;

            // account_list
            generate_accounts();

            // add event listener to password field
            document.getElementById('password').addEventListener('keyup', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    if (on_login_button()) {
                        document.getElementById("menu").innerHTML = "";
                        display_menu();
                        chat_menu();
                    }
                }
            });
        });
}

function display_menu() {
    fetch('pages/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu").innerHTML = data;
        });
}

function pdf_menu() {
    fetch('pages/pdf.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("app").innerHTML = data;

            // load pdfs
            draw_pdf();
        });
}

function chat_menu() {
    fetch('pages/chat.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("app").innerHTML = data;

            // load chat trees
            load_current_chat_tree();

            // add event listener to message field
            document.getElementById('message').addEventListener('keyup', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    on_send_button();
                }
        });
    });
}

function history_menu() {
    fetch('pages/history.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("app").innerHTML = data;
        });
}

function logout_menu() {
    temporary_clear();
    // clear chat
    document.getElementById("app").innerHTML = "";
    login_page();
}
