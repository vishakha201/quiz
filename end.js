const username = document.querySelector('#username')
const saveScoreBtn = document.querySelector('#saveScoreBtn')
const finalScore = document.querySelector('#finalScore')
const mostRecentScore = localStorage.getItem('mostRecentScore')

const highScores = JSON.parse(localStorage.getItem('highScores')) || []

const MAX_HIGH_SCORES = 10

finalScore.innerText = "Score : " + mostRecentScore

//If someone gets all questions of a particular quiz Right
if (mostRecentScore == (MAX_HIGH_SCORES * 100))
    document.getElementById("if-all-correct").style.display = "block";

//If someone gets all questions of a particular quiz Wrong
if (mostRecentScore == (0))
    document.getElementById("if-all-wrong").style.display = "block";


if (((highScores.length == 0) || (mostRecentScore > highScores[0].score)) && (mostRecentScore != 0)) {
    congrats.innerText = "Congratulations, New High Score!!"
    congrats.style.display = 'block'
}


var catCode1 = window.location.search.split("=")[1];
var a = document.getElementById('againlink');
a.href = "game.html?cat=" + catCode1;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value
})


saveHighScore = e => {
    e.preventDefault();
    var t;
    var r = window.location.search.split("=")[1];

    fetch("./questions.json")
        .then((response) => response.json())
        .then((data) => {
            subCat = data.Subcategories.filter((cat) =>
                cat.id === r
            )
            t = subCat[0] && subCat[0].Subcategory;
            // console.log(t);

            const score = {
                score: mostRecentScore,
                name: username.value,
                category: t
            }
            highScores.push(score)

            highScores.sort((a, b) => {
                return b.score - a.score
            })
            highScores.splice(10)
            localStorage.setItem('highScores', JSON.stringify(highScores))
        });

    document.querySelector("#scoresaved").style.display = 'block'
    document.querySelector("#ldb").style.display = 'block'

    var elements = ['#saveScoreBtn', '#username', '#end-text'];
    elements.forEach(x => {
        document.querySelector(x).style.display = 'none';
    });

}