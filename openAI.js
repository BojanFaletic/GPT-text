/*
[
{"token": "<|im_start|>"},
"system\nYou are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: 2023-03-01",
{"token": "<|im_end|>"}, "\n", {"token": "<|im_start|>"},
"user\nHow are you",
{"token": "<|im_end|>"}, "\n", {"token": "<|im_start|>"},
"assistant\nI am doing well!",
{"token": "<|im_end|>"}, "\n", {"token": "<|im_start|>"},
"user\nHow are you now?",
{"token": "<|im_end|>"}, "\n"
]
*/


function test_model(question) {
    const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
    };

    const message = [{ "role": "user", "content": question }];

    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: message,
    };

    return fetch(API_ENDPOINT, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestData)
    }).then(response => response.json())
        .then(data => {
            return data.choices[0].message["content"];
        })
        .catch(error => {
            throw error;
        });
}

/*
function test() {
    var question = "How are you?";
    test_model(question).then(data => {
        console.log(data);
    });
}
*/