
// API for storing data in the browser's local storage
function permanent_store(key, value){
    localStorage.setItem(key, value);
}

function permanent_retrieve(key){
    return localStorage.getItem(key);
}

function permanent_clear(){
    localStorage.clear();
}

// API for storing data in the browser's session storage
function temporary_store(key, value){
    sessionStorage.setItem(key, value);
}

function temporary_retrieve(key){
    return sessionStorage.getItem(key);
}

function temporary_clear(){
    sessionStorage.clear();
}


// Testing
function permanent_init(){
    permanent_clear();

    // TODO: password should be hashed
    /*
    var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");​
    var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
    */
    const account = {"account1": "p1", "account2": "p2", "account3": "p3"};
    permanent_store("accounts", JSON.stringify(account));
}

function temporary_init(){
    temporary_clear();

    const selected_account = "";
    temporary_store("selected_account", selected_account);
}