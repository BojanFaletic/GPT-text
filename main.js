/* TODO: add support for markdown
Here is a simple Python function that prints "Hello, World!" when called: ``` def hello_world(): print("Hello, World!") ``` To call this function, simply type `hello_world()` in your Python environment.
*/

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

// load chat trees from local storage
function load_current_chat_tree() {
    const chat_trees = JSON.parse(temporary_retrieve("chat_trees"));
    if (chat_trees == null) {
        return;
    }
    for (let i = 0; i < chat_trees.length; i++) {
        let chat_tree = chat_trees[i];
        if (i % 2 == 0) {
            add_user_message(chat_tree);
        } else {
            add_chat_message(chat_tree);
        }
    }
}

// user sends message in chat
function on_send_button() {
    // get from text from message
    var msg = document.getElementById('message');
    const question = msg.value.trim();
    msg.value = "";

    // check if api key is valid
    if (temporary_retrieve("valid_account") == "false") {
        msg.value = "Your API key is invalid. Please register a new account."
        return;
    }

    /* check if message is empty */
    if (question == "") {
        return;
    }

    // add user message to chat
    add_user_message(question);

    // add bot message to chat
    ask_gpt(question).then((response) => {
        add_chat_message(response);

        // add response to history
        var chat_trees = JSON.parse(temporary_retrieve("chat_trees"));
        if (chat_trees == null) {
            chat_trees = [];
        }
        chat_trees.push(question);
        chat_trees.push(response);
        temporary_store("chat_trees", JSON.stringify(chat_trees));
    }).catch((error) => {
        console.log(error);
    });
}

// Add account to list
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

    // check if account is valid
    console.log(open_AI_key);
    temporary_store("open_AI_key", open_AI_key);
    get_valid_account().then((response) => {

        // check if account is valid
        temporary_store("valid_account", response != null);
        if (temporary_retrieve("valid_account") == "false") {
            alert("Invalid API key");
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

    });
}

// create account menu
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
        const key_blob = CryptoJS.AES.decrypt(encrypted_key, password);
        const key = key_blob.toString(CryptoJS.enc.Utf8);

        temporary_store("open_AI_key", key);

        // check if key is valid
        get_valid_account().then((response) => {
            temporary_store("valid_account", response != null);
        });

        // clear app div 
        app = document.getElementById("app");
        app.innerHTML = "";
        return true;
    }

    console.log("Incorrect password");
    return;
}

// delete account
function on_delete_button() {
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


// upload file
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
                            pdf_data = JSON.parse(permanent_retrieve("pdf_data"));
                            if (pdf_data == null) {
                                pdf_data = {};
                            }
                            pdf_data[file_name] = textContent.join('\n');
                            permanent_store("pdf_data", JSON.stringify(pdf_data));

                            // draw pdf
                            draw_pdf();
                        };
                    });
                });
            }
        });
    };
    reader.readAsArrayBuffer(file);
}

// delete pdf
function on_delete_pdf(){
    // get selected pdf
    let selected_pdf = temporary_retrieve("selected_pdf");

    // check if pdf is selected
    if (!selected_pdf) {
        console.log("No pdf selected");
        return;
    }

    // delete pdf
    let pdf_data = JSON.parse(permanent_retrieve("pdf_data"));
    delete pdf_data[selected_pdf];
    permanent_store("pdf_data", JSON.stringify(pdf_data));
    temporary_store("selected_pdf", "");

    // reload pdfs
    draw_pdf();
}

function draw_pdf() {
    // add HTML div to id = pdf_list
    const pdf_list = document.getElementById("pdf_list");
    pdf_list.innerHTML = "";

    const pdf_data = JSON.parse(permanent_retrieve("pdf_data"));
    for (file_name in pdf_data) {

        // insert button
        var button = document.createElement("button");
        button.type = "text";
        button.id = file_name;
        button.innerHTML = file_name;
        button.className = "pdf_buttons";
        pdf_list.appendChild(button);
    }

    // add onclick event to buttons
    const buttons = document.getElementsByClassName("pdf_buttons");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            // clear all buttons
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.backgroundColor = "white";
            }

            // set selected pdf
            temporary_store("selected_pdf", buttons[i].id);
            buttons[i].style.backgroundColor = "lightblue";

            // display text
            displayText();
        }
    }
}

function displayText() {
    const selected_pdf = temporary_retrieve("selected_pdf");
    const pdf_data = JSON.parse(permanent_retrieve("pdf_data"));

    const textContainer = document.getElementById('text-container');
    textContainer.innerText = pdf_data[selected_pdf];
}
