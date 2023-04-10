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
function on_send_button() {
    // get from text from message
    var msg = document.getElementById('message');
    const question  = msg.value.trim();
    msg.value = "";

    /* check if message is empty */
    if (question == "") {
        return;
    }

    // add user message to chat
    add_user_message(question);
   
    // add bot message to chat
    ask_gpt(question).then((response) => {
        add_chat_message(response);
    }).catch((error) => {
        console.log(error);
    });
}

// Add account to list (TODO)
function on_register_button() {
    const username = document.getElementById("username").value;
    let password = document.getElementById("password_1").value;
    let password_2 = document.getElementById("password_2").value;
    let open_AI_key = document.getElementById("key").value;

    // check if username is null
    if (username.trim() == "") {
        alert("Username cannot be empty");
        return;
    }

    // check if username is taken
    users = JSON.parse(permanent_retrieve("accounts"))
    // add account to list
    if (users == null) {
        users = {};
    }

    // check if username is taken
    if (username in users) {
        alert("Username is taken");
        return;
    }

    // check if passwords match
    if (password != password_2) {
        alert("Passwords do not match");
        return;
    }

    // hash password
    var sha = CryptoJS.SHA256(password);
    var sha_password = sha.toString();

    var encrypted_password = CryptoJS.AES.encrypt(open_AI_key, password);
    var encoded_password = encrypted_password.toString();

    // add account to list
    users[username] = [sha_password, encoded_password];
    permanent_store("accounts", JSON.stringify(users));
    temporary_store("selected_account", username);

    // clear registration menu
    document.getElementById("menu").innerHTML = "";
    display_menu();
    chat_menu();
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
        button.onclick = function () {
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

    // check if account is selected
    if (!selected_account) {
        console.log("No account selected");
        return;
    }

    // get password hash
    let password = document.getElementById("password").value;
    document.getElementById("password").value = "";
    const password_hash = CryptoJS.SHA256(password).toString();

    // get stored password hash
    const account_blob = JSON.parse(permanent_retrieve("accounts"));
    const stored_password_hash = account_blob[selected_account][0];

    // check if password is correct
    if (password_hash == stored_password_hash) {
        // store open AI key
        const encrypted_key = account_blob[selected_account][1];
        var key = CryptoJS.AES.decrypt(encrypted_key, password);
        temporary_store("open_AI_key", key.toString(CryptoJS.enc.Utf8));

        // clear app div 
        app = document.getElementById("app");
        app.innerHTML = "";
        return true;        
    }

    console.log("Incorrect password");
    return;
}

function on_delete_button(){
    // get selected account
    let selected_account = temporary_retrieve("selected_account");
    
    // check if account is selected
    if (!selected_account) {
        console.log("No account selected");
        return;
    }

    // delete account
    let accounts = JSON.parse(permanent_retrieve("accounts"));
    delete accounts[selected_account];
    permanent_store("accounts", JSON.stringify(accounts));
    temporary_store("selected_account", "");

    // reload accounts
    document.getElementById("accounts").innerHTML = "";
    generate_accounts();
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
