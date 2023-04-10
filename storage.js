
// API for storing data in the browser's local storage
function permanent_store(key, value) {
    localStorage.setItem(key, value);
}

function permanent_retrieve(key) {
    return localStorage.getItem(key);
}

function permanent_clear() {
    localStorage.clear();
}

// API for storing data in the browser's session storage
function temporary_store(key, value) {
    sessionStorage.setItem(key, value);
}

function temporary_retrieve(key) {
    return sessionStorage.getItem(key);
}

function temporary_clear() {
    sessionStorage.clear();
}


function permanent_init() {
    // [username] = [password, openAI_key]
    fetch("preset_accounts.json")
        .then(response => response.json())
        .then(data => {
            permanent_clear();
            permanent_store("accounts", JSON.stringify(data));
        })
        .catch((error) => {
            console.log("No preset accounts found");
        });
}

function temporary_init() {
    temporary_clear();

    const selected_account = "";
    temporary_store("selected_account", selected_account);
    temporary_store("open_AI_key", "");

    // chat trees
    fetch("current_chain.json")
        .then(response => response.json())
        .then(data => {
            temporary_store("chat_trees", JSON.stringify(data));
        })
        .catch((error) => {
            console.log("No chat trees found");
        });
}