const highScoresList = document.querySelector('#highScoresList')
const highScores = JSON.parse(localStorage.getItem("highScores")) || []
//To clear the Local Storage, use - window.localStorage.clear()
//Used secretly on index.html page in smiley :-)

//To get records from the Local Storage and Display as List items on the web page
highScoresList.innerHTML =
    highScores.map(score => {
        return `<li class="high-score">${score.name} - ${score.category} - ${score.score} </li>`
    }).join("")

//Hide High Scores List if No Records exist in the Local Storage
if (highScoresList.innerHTML == '')
    highScoresList.style.display = "none";
else
    highScoresList.style.display = "block";

//To add a Crown in front of the name of the person topping the leaderboard
var x = document.getElementById("highScoresList").firstElementChild;
var node = document.createElement("I");
var textnode = document.createTextNode("");
node.classList.add("fas");
node.classList.add("fa-crown");
x.appendChild(node);