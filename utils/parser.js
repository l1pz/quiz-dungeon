function getQuestions() {
    let questions = [];
    for (let i = 1; i < 61; i += 6) { 
        let question = {}; 
        question.question = document.querySelector(`#formTesztValaszok > h4:nth-child(${i}) > span:nth-child(2)`)?.innerHTML.trim();
        question.answers = []
        for(let j = 1; j < 5; j++) {
            let answer = document.querySelector(`#formTesztValaszok > blockquote:nth-child(${i+j})`).innerText.trim();
            question.answers.push(answer);
        }
        questions.push(question) 
    };
    localStorage.setItem("questions", JSON.stringify(questions));
}

function getAnswers() {
    let questions = JSON.parse(localStorage.getItem("questions"));
    let counter = 0;
    for (let i = 2; i < 32; i += 3) { 
        let correct = document.querySelector(`#textContent > div.teszt_box > blockquote:nth-child(${i})`).innerText.split("\n")[2].trim();
        questions[counter].correct = correct;
        counter++;
    }
    console.log(JSON.stringify(questions));
}

