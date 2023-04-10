// add bot message to chat
function add_chat_message(text) {
    var chat = document.getElementById('chat_history');

    // make box 1 and append to chat
    var msg_user = document.createElement('div');
    msg_user.className = 'msg_bot';
    var msg_icon = document.createElement('img');
    msg_icon.src = 'images/gpt4.png';
    msg_icon.alt = 'gpt';
    msg_icon.className = 'msg_icon';
    msg_user.appendChild(msg_icon);

    // add paragraph
    var msg_text = document.createElement('p');
    msg_text.className = 'msg_text';
    msg_text.innerHTML = text;
    msg_user.appendChild(msg_text);

    msg_user.appendChild(msg_text);
    chat.appendChild(msg_user);
}

// add user message to chat
function add_user_message(text) {
    var chat = document.getElementById('chat_history');

    // make box 1 and append to chat
    var msg_user = document.createElement('div');
    msg_user.className = 'msg_user';
    var msg_icon = document.createElement('img');
    msg_icon.src = 'images/user.png';
    msg_icon.alt = 'gpt';
    msg_icon.className = 'msg_icon';
    msg_user.appendChild(msg_icon);

    // add paragraph
    var msg_text = document.createElement('p');
    msg_text.className = 'msg_text';
    msg_text.innerHTML = text;
    msg_user.appendChild(msg_text);

    chat.appendChild(msg_user);
}

// user sends message in chat
var tmp = 3;
function on_send_button() {
    // get from text from message
    var msg = document.getElementById('message');
    msg.value = msg.value.trim();

    /* check if message is empty */
    if (msg.value == "") {
        return;
    }

    console.log(msg.value);

    // add user message to chat
    add_user_message(msg.value);
    msg.value = "";

    // add bot message to chat
    add_chat_message("hello world " + tmp);
    tmp += 1;
}


// toggle registration menu
var is_registration_selected = false;
function on_menu_registration() {
    is_registration_selected = !is_registration_selected;
}

// Add account to list (TODO)
function on_register_button() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password_1").value;
    let password_2 = document.getElementById("password_2").value;
    let open_AI_key = document.getElementById("key").value;

    if (password != password_2) {
        alert("Passwords do not match");
        return;
    }

    console.log("OpenAI key: " + open_AI_key);
}

function generate_accounts() {
    let account_list = document.getElementById("accounts");
    const accounts = JSON.parse(permanent_retrieve("accounts"));
    let id = 0;

    for (let account in accounts) {
        let button = document.createElement("button");
        button.type = "text";
        button.id = id;
        button.innerHTML = account;

        // set class
        button.className = "account_button";

        // when button is clicked select the account
        button.onclick = function() {
            // clear all buttons
            let buttons = document.getElementsByClassName("account_button");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.backgroundColor = "white";
            }

            temporary_store("selected_account", account);
            button.style.backgroundColor = "lightblue";

        }

        account_list.appendChild(button);
        id += 1;
    }    
}

// login into existing account
function on_login_button() {
    let selected_account = temporary_retrieve("selected_account");
    let password = document.getElementById("password").value;

    // clear password
    document.getElementById("password").value = "";

    // check if account is selected
    if (!selected_account) {
        console.log("No account selected");
        return;
    }

    // check if password is correct
    const account_passwords = JSON.parse(permanent_retrieve("accounts"));
    if (password != account_passwords[selected_account]) {
        console.log("Incorrect password");
        return;
    }

    console.log("Login: " + selected_account + " " + password);
    
    // clear app div 
    app = document.getElementById("app");
    app.innerHTML = ""; 

    console.log("here");

    return true;
}


let pdf_data = {};

function on_upload_button() {
    console.log("Upload button pressed");

    // get file
    let file = document.getElementById("file").files[0];

    // check if file is selected
    if (file == null) {
        console.log("No file selected");
        return;
    }

    // read file as PDF
    const reader = new FileReader();
    reader.onload = function (event) {
        const pdfData = new Uint8Array(event.target.result);
        pdfjsLib.getDocument(pdfData).promise.then(function (pdf) {
            const textContent = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                pdf.getPage(i).then(function (page) {
                    page.getTextContent().then(function (content) {
                        content.items.forEach(function (item) {
                            textContent.push(item.str);
                        });
                        if (i === pdf.numPages) {
                            // append text to chat
                            const file_name = file.name;
                            pdf_data[file_name] = textContent.join('\n');

                            // add HTML div to id = pdf_list
                            const pdf_list = document.getElementById("pdf_list");
                            pdf_list.innerHTML += "<div class='pdf' id='" + file_name + "'>" + file_name + "</div>";

                        }
                    });
                });
            }
        });
    };
    reader.readAsArrayBuffer(file);
}

function displayText(text) {
    const textContainer = document.getElementById('text-container');
    textContainer.innerText = text;
}
