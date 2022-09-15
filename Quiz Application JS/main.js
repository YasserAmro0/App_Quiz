// select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletCountainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContanier = document.querySelector(".results");
let countdowenEle = document.querySelector(".countdowen");
let aes = document.querySelectorAll(".choises");
let category = document.querySelector(".category span");
let all = document.querySelector(".all");

// Set Options
let currentIndex = 0;
let RightAnswer = 0;
let countdownIntreval;
function getQuestions() {
    
aes.forEach((bt) => {
    bt.addEventListener("click",(e) => {
        let At = bt.textContent;
        category.innerHTML = `${At}`;
        all.style.display = 'none';
    let MyRequest = new XMLHttpRequest();
    
    MyRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            
            let questionsObject = JSON.parse(this.responseText);
            let qcount = questionsObject.length;
            createBullets(qcount);
            // Add Questions Data
            addQuestionsData(questionsObject[currentIndex], qcount);
            countdown(5, qcount);

            submitButton.onclick = () => {
                // Get right Answer
                let theRightAnswer = questionsObject[currentIndex]["right_answer"];
                // incresae index
                currentIndex++;
                checkAnswer(theRightAnswer, qcount);
                
                // Remove previous Questios
                quizArea.innerHTML = '';
                answerArea.innerHTML = '';
                addQuestionsData(questionsObject[currentIndex], qcount);
                
                // Handle Spans Classes
                handleBullets();
               
                // Time Count
                clearInterval(countdownIntreval);
                 countdown(5, qcount);
                // Show Results
                showResult(qcount);
            };
            
            
        }
    };
    MyRequest.open("Get", `${At}_Questions.json`);
        MyRequest.send();
           })
})

}
getQuestions();

// functions creat Bullets
function createBullets(num) {
    countSpan.innerHTML = num;
    // create Bullet
    for (let i = 0; i < num; i++){
        let TheBullet = document.createElement("span");
// Check if First Span
        if (i === 0) {
            TheBullet.className = 'on';
        }

        // Append In Div Spans
        bulletCountainer.appendChild(TheBullet);
        
    }
}


function addQuestionsData(obj, count) {
    if (currentIndex < count) {
         // Creat H2 Questions Title
    let questiosH2 = document.createElement("h2");
    // Creat Q Text
    let questionsText = document.createTextNode(obj["title"]);
    // Append 
    questiosH2.appendChild(questionsText);
    quizArea.appendChild(questiosH2); 

    // Create The Enswers
    for (let i = 1; i <= 4; i++){
        let divAnswer = document.createElement("div");
        // Add Class Name
        divAnswer.className = 'answer';
        //Create Radio 
        let radioInput = document.createElement("input");
        // Add type + name + Id + Data Attr
        radioInput.name = 'question';
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        if (i === 1) {
            radioInput.checked='checked';
        }

        // Creat Label
        let theLabel = document.createElement("label");
        // Add For Attr
        theLabel.htmlFor = `answer_${i}`;
        // Creat Label Text
        let thelabelText = document.createTextNode(obj[`answer_${i}`]);
        // Add the Text To Label
        theLabel.appendChild(thelabelText);
        // Add Input + Label to mian Div
        divAnswer.appendChild(radioInput);
        divAnswer.appendChild(theLabel);
        // Add All in AnswerArea
        answerArea.appendChild(divAnswer);

    }
    }
}

function checkAnswer(RAnswer, qcount) {
    let answerss = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0; i < answerss.length; i++){
        if (answerss[i].checked) {
            theChoosenAnswer = answerss[i].dataset.answer;
        }
    }
    if (RAnswer === theChoosenAnswer) {
        RightAnswer++;
        console.log("good");
   }
}

function handleBullets() {
    let bullets = document.querySelectorAll(".bullets .spans span");
    let arrOfSpan = Array.from(bullets);
    arrOfSpan.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    });
}
function showResult(count) {
    let TheResult;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();
        if (RightAnswer > (count / 2) && RightAnswer < count) {
            TheResult = `<span class="good">Good</span> Your Answer is ${RightAnswer} / ${count}`;
        } else if (RightAnswer === count) {
             TheResult = `<span class="Perfect">Perfect</span> Your Answer is ${RightAnswer} / ${count}`;
        } else {
            TheResult = `<span class="bad">bad</span> Your Answer is ${RightAnswer} / ${count}`;
        }

        resultsContanier.innerHTML = TheResult;
        resultsContanier.style.padding = '10px';
        resultsContanier.style.backgroundColor = 'white';
        resultsContanier.style.marginTop = '20px';
    }
}


function countdown(duration,count) {
    if (currentIndex < count) {
        let minutes, secound;
        countdownIntreval = setInterval(function () {
            minutes = parseInt(duration / 60);
            secound = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            secound = secound < 10 ? `0${secound}` : secound;

            countdowenEle.innerHTML = `${minutes}:${secound}`;
            if (--duration < 0) {
                clearInterval(countdownIntreval);
                submitButton.click();
            }

        },1000);
    }
};

