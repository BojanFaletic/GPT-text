/* TODO: add support for markdown
Here is a simple Python function that prints "Hello, World!" when called: ``` def hello_world(): print("Hello, World!") ``` To call this function, simply type `hello_world()` in your Python environment.
*/

// add bot message to chat
function add_chat_message(text) {
    var chat = document.getElementById('chat_history');
    fetch('pages/msg_box_chat.html')
        .then(response => response.text())
        .then(data => {
            chat.innerHTML += data;
            var msg_text = document.getElementsByClassName('msg_text');
            msg_text[msg_text.length - 1].innerHTML = text;
        });
}

// add user message to chat
function add_user_message(text) {
    var chat = document.getElementById('chat_history');
    fetch('pages/msg_box_user.html')
        .then(response => response.text())
        .then(data => {
            chat.innerHTML += data;
            var msg_text = document.getElementsByClassName('msg_text');
            msg_text[msg_text.length - 1].innerHTML = text;
        });
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
                            pdf_store(file_name, textContent.join('\n'));

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
    if (!selected_pdf) {
        console.log("No pdf selected");
        return;
    }

    // delete PDF
    pdf_remove(selected_pdf);
    temporary_store("selected_pdf", "");

    // reload PDFs
    draw_pdf();
}

function draw_pdf() {
    // add HTML div to id = pdf_list
    const pdf_list = document.getElementById("pdf_list");
    pdf_list.innerHTML = "";

    const pdf_data = JSON.parse(permanent_retrieve("pdf"));
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


// split pdf into chunks
function split_pdf_to_chunks(text){
    const average_chunk_length = 1000;
    const max_chunk_length = 2000;
    const hard_separator = '\n\n';
    const soft_separator = '\n';

    let chunks = text.split(hard_separator);

    // while chunks are too short, merge them
    for (let i = 0; i < chunks.length - 1; i++) {
        while (chunks[i].length + chunks[i + 1].length < average_chunk_length) {
            chunks[i] += hard_separator + chunks[i + 1];
            chunks.splice(i + 1, 1);

            // check if next chunk exists
            if (i + 1 >= chunks.length) {
                break;
            }
        }
    }

    // while chunks are too long, split them
    for (let i = 0; i < chunks.length; i++) {
        while (chunks[i].length > max_chunk_length) {
            const split_index = chunks[i].lastIndexOf(soft_separator, max_chunk_length);
            chunks.splice(i + 1, 0, chunks[i].substring(split_index + 1));
            chunks[i] = chunks[i].substring(0, split_index);

            // check if next chunk exists
            if (i + 1 >= chunks.length) {
                break;
            }
        }
    }

    return chunks;
}

function displayText() {
    const selected_pdf = temporary_retrieve("selected_pdf");
    if (!selected_pdf) {
        return;
    }
    const pdf_data = pdf_retrieve(selected_pdf);
    if (!pdf_data) {
        return;
    }

    // insert full text into div
    /*
    const textContainer = document.getElementById('text-container');
    textContainer.innerText = pdf_data[selected_pdf];
    */

    // chunk preprocessing
    
    // split text into chunks
    
    // render chunks
    const chunkContainer = document.getElementById('text_chunks');
    chunkContainer.innerHTML = "";

    const chunks = pdf_data["chunk"];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = document.createElement('div');
        chunk.className = 'chunk';
        chunk.innerText = '<chunk id='+i+'>\n' + chunks[i] + '\n</chunk>';
        chunkContainer.appendChild(chunk);
    }
}
