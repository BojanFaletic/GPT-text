

/* on page load */
document.addEventListener('DOMContentLoaded', function () {
    /* add event listener to message when enter is pressed */
    document.getElementById('message').addEventListener('keyup', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            on_send_button();
        }
    });

    // add event listener to login text box
    document.getElementById('password').addEventListener('keyup', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            on_login_button();
        }
    });
    // initiate all existing accounts
    generate_accounts();

    // initiate UI
    init_UI();
});

// initiate UI
function init_UI(){
    document.getElementById("registration").style.visibility = "hidden";
    document.getElementById("chat").style.visibility = "hidden";
    document.getElementById("login_section").style.visibility = "hidden";
}


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
function on_menu_registration(){
    if (is_registration_selected){
        document.getElementById("registration").style.visibility = "hidden";
    }
    else{
        document.getElementById("registration").style.visibility = "visible";
    }
    is_registration_selected = !is_registration_selected;
}

// Add account to list (TODO)
function on_register_button(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password_1").value;
    let password_2 = document.getElementById("password_2").value;
    let open_AI_key = document.getElementById("key").value;

    if (password != password_2){
        alert("Passwords do not match");
        return;
    }
    
    console.log("OpenAI key: " + open_AI_key);    
}

// list of accounts (needs to be stored in database)
var accounts = ["account1", "account2", "account3"]
var passwords = ["p1", "p2", "p3"]
var selected_account = -1;

function generate_accounts(){
    let account_list = document.getElementById("accounts");

    for (let i = 0; i < accounts.length; i++){
        let account = document.createElement("button");
        account.type = "text";
        account.id = accounts[i];
        account.innerHTML = accounts[i];

        account.style.backgroundColor = "#FFFFFF";
        account.onclick = function(){
            // change color of selected account
            if (selected_account != -1){
                document.getElementById(accounts[selected_account]).style.backgroundColor = "#FFFFFF";
            }
            // change color of new account
            account.style.backgroundColor = "#00FF00";   
            
            // update selected account
            selected_account = i;
            document.getElementById("login_section").style.visibility = "visible";
        }

        account_list.appendChild(account);
    }
}

// login into existing account
function on_login_button(){
    let username = accounts[selected_account];
    let password = document.getElementById("password").value;

    // clear password
    document.getElementById("password").value = "";

    // check if account is selected
    if (selected_account == -1){
        console.log("No account selected");
        return;
    }
    
    // check if password is correct
    if (password != passwords[selected_account]){
        console.log("Incorrect password");
        return;
    }

    console.log("Login: " + username + " " + password);
    document.getElementById("chat").style.visibility = "visible";
}
