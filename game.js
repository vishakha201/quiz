let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let styles = [];
var subCat;

//Points for each correct question
const SCORE_POINTS = 100;
var MAX_QUESTIONS = 10;

startGame = (questions) => {
  questionCounter = 0;
  score = 0;
  getNewQuestion(questions);
};
//To set different Styles for different Subcategories
setStyles = (styles) => {

  document.querySelector("#cat").style.color = styles.topTextColor; 
  //Color of the Category

  var a = styles.Background; //Background of the page

  if (a.length <= 20) document.body.style.backgroundColor = a;
  //Assuming entered a Color name or Hex Value
  else if (a[0] == "l") document.body.style.backgroundImage = a;
  //Assuming it is a linear Gradient
  else document.body.style.backgroundImage = "url(" + a + ")";
  //Assuming it is the link of an image

  var b = styles.progressBarColor; //Color of the Progress bar
  $("#progressBar").css("borderColor", b);
  $("#progressBarFull").css("background", b);

  var c = styles.topTextColor; //Color of the Question, Timer and Text on top of the Progress Bar (Question number)
  var elements2 = [
    "#progressText",
    ".hud-prefix_ch",
    ".hud-prefix_cd",
    "#question",
  ];
  elements2.forEach((x) => {
    document.querySelector(x).style.color = c;
  });

  var d = styles.optionTextColor; //Color of the options
  $(".choice-prefix").css("color", d);
  $(".choice-text").css("color", d);

  var e = styles.optionBgColor; //Background Color of the options
  $(".choice-container").css("background", e);
};

//Main Quiz Page Interface
getNewQuestion = (availableQuestions) => {
  console.log(catCode);
  // console.log(availableQuestions.length);
  if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("end.html?cat=" + catCode);
  }

  if (catCode === "fball") {
    MAX_QUESTIONS = 50;
  }

  const question = document.querySelector("#question");
  const choices = Array.from(document.querySelectorAll(".choice-text"));
  const progressText = document.querySelector("#progressText");
  const progressBarFull = document.querySelector("#progressBarFull");

  questionCounter++;
  progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionsIndex];
  // console.log(currentQuestion.question.length)

  if (currentQuestion.question.length > 300) {
    //If question is too lengthy
    document.querySelector("#question").style.fontSize = "3.5rem";
    document.querySelector(".container").style.marginTop = "90px";
  } else if (currentQuestion.question.length > 135) {
    document.querySelector("#question").style.fontSize = "4rem";
    document.querySelector(".container").style.marginTop = "60px";
  } else {
    document.querySelector("#question").style.fontSize = "5.4rem";
    document.querySelector(".container").style.marginTop = "0";
  }

  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionsIndex, 1);
  acceptingAnswers = true;

  //Quiz Evaluation
  choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
      if (!acceptingAnswers) return;

      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];

      let isCorrect =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

      if (isCorrect === "correct") {
        incrementScore(SCORE_POINTS);
      }

      setTimeout(() => {
        getNewQuestion(availableQuestions);
      }, 800);
    });
  });
  incrementScore = (num) => {
    score += num;
  };
};

var catCode = window.location.search.split("=")[1];

//To fetch Styles and Questions from Json file
fetch("./questions.json")
  .then((response) => response.json())
  .then((data) => {
    subCat = data.Subcategories.filter((cat) => cat.id === catCode);
    questions = subCat[0].Questions;
    styles = subCat[0].Styles;
    setStyles(styles[0]);
    startGame(questions);
  });

fetch("./questions.json")
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#cat").innerText = (data.Subcategories.filter((cat) => cat.id === catCode)[0].Subcategory);
  });


//Timer which is being displayed during the quiz
var count = 181; //The amount of time for the particlar quiz

var interval = setInterval(function () {
  var minutes = Math.floor(count / 60);
  var seconds = count - minutes * 60;
  if (document.querySelector(".hud-prefix_cd"))
    document.querySelector(".hud-prefix_cd").innerText =
      minutes + " Minutes " + seconds + " Seconds ";
  count--;
  if (count <= -1) {
    clearInterval(interval);
    document.querySelector(".hud-prefix_cd").style.color = "red";
    document.querySelector(".hud-prefix_ch").style.visibility = "hidden";
    document.querySelector(".hud-prefix_cd").innerHTML =
      "Sorry, You're Out of Time";
    acceptingAnswers = false; //So that someone dosen't try to answer after the time is up
    setInterval(function () {
      questionCounter = MAX_QUESTIONS + 1;
      acceptingAnswers = false;
      getNewQuestion(availableQuestions);
    }, 1200);
  }
}, 1000);
