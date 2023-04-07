
if (false) {
var is_key_pressed = true;

// wait for document to load
document.addEventListener('DOMContentLoaded', function () {
    // get app id from html
    var app = document.getElementById('app');
    if (is_key_pressed) {
        app.innerHTML = 'Hello World';
    }
    else {
        app.innerHTML = 'Goodbye World';
    }

    /*
    add_chat_message("hello world");
    add_user_message("no hello world");

    add_chat_message("hello world 2");
    //add_user_message("no hello world 4");
    */
});
}


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
    var msg_text = document.createTextNode(text);
    msg_user.appendChild(msg_text);
    chat.appendChild(msg_user);
}

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
    var msg_text = document.createTextNode(text);
    msg_user.appendChild(msg_text);
    chat.appendChild(msg_user);
}

var tmp = 3;

function on_send_button(){
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