
// API for storing data in the browser's local storage
function permanent_store(key, value) {
    localStorage.setItem(key, value);
}

function permanent_retrieve(key) {
    return localStorage.getItem(key);
}

function permanent_delete(key) {
    localStorage.removeItem(key);
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


/* Description: initialize permanent storage
    pdf_name : {    <--- pdf_name is the name of the pdf file
        {name1 : id1}
        {name2 : id2}
    }

    id1: { <--- id is the name of the pdf file + the number of PDFs with the same name
        data: [full_pdf_data]
        chunk: [text]
        embed: [embed]
    }
    ...
*/

// description: store pdf data
function pdf_store(pdf_name, pdf_data) {
    // get list of PDFs and add new one
    let pdf_data_json = JSON.parse(permanent_retrieve("pdf"));
    if (pdf_data_json == null) {
        pdf_data_json = {};
    }

    // get highest id of all stored PDF ids
    const id_separator = "__";
    let highest_id = 0;
    for (const key in pdf_data_json) {
        const id = pdf_data_json[key].split(id_separator)[1];
        const id_num = parseInt(id);
        if (id_num > highest_id) {
            highest_id = id_num;
        }
    }

    // store PDF name and id
    const pdf_id_name = pdf_name + id_separator + (highest_id + 1);
    pdf_data_json[pdf_name] = pdf_id_name;
    permanent_store("pdf", JSON.stringify(pdf_data_json));

    // store PDF data
    const pdf_id = {
        "data": pdf_data,
        "chunk": split_pdf_to_chunks(pdf_data),
        "embed": []
    };
    permanent_store(pdf_id_name, JSON.stringify(pdf_id));
}


// retrieve pdf data
function pdf_retrieve(pdf_name) {
    // look up pdf id
    const pdf_data_json = JSON.parse(permanent_retrieve("pdf"));
    if (pdf_data_json == null) {
        return null;
    }
    const pdf_id_name = pdf_data_json[pdf_name];
    if (pdf_id_name == null) {
        return null;
    }

    // look up pdf data
    const pdf_id = JSON.parse(permanent_retrieve(pdf_id_name));
    return pdf_id;
}


// remove pdf from storage
function pdf_remove(pdf_name) {
    // look up pdf id
    const pdf_data_json = JSON.parse(permanent_retrieve("pdf"));
    if (pdf_data_json == null) {
        return;
    }
    const pdf_id_name = pdf_data_json[pdf_name];
    if (pdf_id_name == null) {
        return;
    }

    // remove pdf value
    permanent_delete(pdf_id_name);

    // remove pdf name
    delete pdf_data_json[pdf_name];
    permanent_store("pdf", JSON.stringify(pdf_data_json));
}


function permanent_init() {
    // [username] = [password, openAI_key]
    fetch("private/preset_accounts.json")
        .then(response => response.json())
        .then(data => {
            permanent_clear();
            permanent_store("accounts", JSON.stringify(data));
        })
        .catch((error) => {
            console.log("No preset accounts found");
        });

    fetch("private/pdf_data.json")
        .then(response => response.json())
        .then(data => {
            permanent_store("pdf_data", JSON.stringify(data));
        })
        .catch((error) => {
            console.log("No pdf data found");
        });
}

function temporary_init() {
    temporary_clear();

    const selected_account = "";
    temporary_store("selected_account", selected_account);
    temporary_store("open_AI_key", "");
    temporary_store("valid_account", false);

    // chat trees
    fetch("private/current_chain.json")
        .then(response => response.json())
        .then(data => {
            temporary_store("chat_trees", JSON.stringify(data));
        })
        .catch((error) => {
            console.log("No chat trees found");
        });
}
