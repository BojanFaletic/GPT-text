
// Ask GPT-3 a question and get a response
async function ask_gpt(question) {
    const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    const key = temporary_retrieve("open_AI_key");

    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
    };

    // make chat history
    const chat_trees = JSON.parse(temporary_retrieve("chat_trees"));
    if (chat_trees.length % 2 != 0) {
        console.log("Error: chat_trees is not even");
        return;
    }
    var message = [];
    for (let i = 0; i < chat_trees.length; i++) {
        const role = i%2 == 0 ? "user" : "assistant";
        message.push({ "role": role, "content": chat_trees[i]});
    }
    // add current question to chat history
    message.push({ "role": "user", "content": question }); 
    
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: message,
        temperature: 0.0,
    };

    const request = fetch(API_ENDPOINT, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestData)
    });

    const response = await request;
    const data = await response.json();
    return data.choices[0].message["content"];
}

// Get the embedding of a text
async function get_embedding(text) {
    const API_ENDPOINT = 'https://api.openai.com/v1/embeddings';
    const key = temporary_retrieve("open_AI_key");

    const data = {
        "input": text,
        "model": "text-embedding-ada-002"
    };

    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify(data)
    };

    const request = await fetch(API_ENDPOINT, options);
    const response = await request.json();
    return response.data[0].embedding;
}

// Check if the OpenAI key is valid
function get_valid_account() {
    const API_ENDPOINT = 'https://api.openai.com/v1/models';
    const key = temporary_retrieve("open_AI_key");

    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
    };

    fetch(API_ENDPOINT, {
        method: 'GET',
        headers: requestHeaders,
    })
        .then(response => response.json())
        .then(data => {
            return true;
        })
        .catch(error => {
            return false;
        });
}

/*
function test_e() {
    var question = "How are you?";
    get_embedding(question).then(data => {
        console.log(data);
    });
}

function test_g() {
    var question = "How are you?";
    ask_gpt(question).then(data => {
        console.log(data);
    });
}
*/