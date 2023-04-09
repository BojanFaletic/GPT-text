
// on page load
document.addEventListener('DOMContentLoaded', function () {
    login_menu();
});


function registration_menu() {
    const data = ' \
    \
    <!-- registration -->\
    <div id="registration">\
        <input type="text" id="username" placeholder="Profile name">\
        <input type="password" id="password_1" placeholder="Enter your password">\
        <input type="password" id="password_2" placeholder="Repeat your password">\
        <input type="text" id="key" placeholder="Enter Open AI key">\
        \
        <button id="register" onclick=on_register_button()>Register</button>\
    </div>';

    document.getElementById("app").innerHTML = data;
}

function login_menu() {
    const data = '<!-- login -->\
    <div>\
        <!-- list of checkboxes of all existing accounts -->\
        <div id="accounts"></div>\
        <div id="login_section">\
            <input type="password" id="password" placeholder="Enter your password">\
            <button id="login" onclick=on_login_button()>Login</button>\
        </div>\
    </div>';

    document.getElementById("app").innerHTML = data;
}

function pdf_menu() {
    const daata = '\
     <!-- PDF -->\
    <div id="pdf">\
        <!-- upload button -->\
        <div id="upload">\
            <input type="file" id="file" accept="application/pdf">\
            <button id="upload_button" onclick=on_upload_button()>Upload</button>\
        </div>\
        \
        <div id="pdf_list"></div>\
        <div id="text-container"></div>\
    </div>';

    document.getElementById("app").innerHTML = daata;
}

function chat_menu() {
    const data = ' <!-- chat -->\
    <div id="chat">\
        <div id="chat_history"></div>\
        <div class="msg_current">\
            <textarea id="message" placeholder="Enter your message"></textarea>\
            <!-- <button id="send" onclick=on_send_button()>Send</button> -->\
        </div>\
    </div>';

    document.getElementById("app").innerHTML = data;
}