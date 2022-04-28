//max row and column
let height = 6;
let width = 5;

//current row and column
let row = 0;
let col = 0;

let gameOver = false;

let guessList = words;

let wordList = ["ارز", "ابن", "بدوي", "بني", "بين", "ترك", "توت", "ثلاث", "دفتر", "ذكي", "دار", "موز", "ملكة", "ملك", "ميلاد", "هاتف", "هنا", "نهر", "وردي", "والد", "يافا", "كتاب", "لبنان", "زيتون", "رفيقة", "دكتور", "تركيا", "تلميذ"]

guessList = guessList.concat(wordList);

//merging the word list and the guess list
guessList = guessList.concat(wordList);

//geting a random word
let word = wordList[Math.floor(Math.random() * wordList.length)];
console.log(word);

width = word.length;

let letters = "يقهملهكتفنبثـذوازرد"

//when the window loads, initialize
window.onload = function () {
    initialize();
}

function initialize() {

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            //creating a tile
            let tile = document.createElement("span");
            //giving each tile and id that is easy to get to
            tile.id = (i.toString() + '-' + j.toString());
            //giving the tile the tile class
            tile.classList.add("tile");
            //reseting the text
            tile.innerText = "";
            //adding to the board
            document.getElementById("board").appendChild(tile);
        }
    }
    document.getElementById("board").style.width = 69 * word.length + "px";

    //⌫
    let keyboard = [
        ["ا", "ر", "ز", "د", "و", "ذ"],
        ["ب", "ن", "ت", "ث", "ي", "هـ"],
        ["Enter", "ف", "ق", "ك", "ل", "م", "⌫"]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row-1");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if (letters.includes(key)) {
                keyTile.id = key;
            }

            //keyTile.addEventListener("click", processKey);
            keyTile.addEventListener("touchstart", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
                keyboardRow.classList.replace("keyboard-row-1", "keyboard-row-2");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }
    

    //when you lift the finger from a key, proccess the input
    //even though you only do this once, it will always "listen"(proccess input)
    document.addEventListener("keyup", (e) => {
        proccessInput(e);
    })
}

function processKey() {
    e = { "code": this.id };
    console.log(e);
    proccessInput(e);
}

function proccessInput(e) {
    //ignores input if game over
    if (gameOver)
        return;

    //checking if the input is a letter
    if (letters.includes(e.code)) {
        console.log('e');
        //if it is, checking if you have not typed 5 letters yet(like the width)
        if (col < width) {
            //getting the current tile and setting the letter
            //also adding animation class(see css)
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code;
                col += 1;
                currTile.classList.add("pop_anim");
            }
        }
    //if it is not a letter, checking if it is the delete key
    } else if (e.code == "Backspace") {
        //if it is checking that you have typed at least one letter and decreasing the current column
        if (col > 0 && col <= width) {
            col--;
        }
        //getting the current tile and removing the letter
        //also removing animation class(see css)
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
        currTile.classList.remove("pop_anim");
    //if it is not the delete key, checking if it is the enter key(there are 2 enters on the keyboard)
    } else if (e.code == "Enter" || e.code == "NumpadEnter") {
        //if the enter is pressed you want to go down a row(updating)
        update();
    }

    //checking if game over(the current row == max row(height))
    if (gameOver == false && row == height) {
        gameOver = true;
        //showing the word
        document.getElementById("answer").innerText = word;
        copyResult();
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    //getting the word as a string
    for (let i = 0; i < width; i++) {
        let currTile = document.getElementById(row.toString() + '-' + i.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    console.log(guess);

    //if you have not typed enough letters, don't do anything
    if (guess.length < width)
        return;
    //checking if the word is invalid
    else if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Not in word list";
        //adding shake animation
        for (let i = 0; i < width; i++) {
            let currTile = document.getElementById(row.toString() + '-' + i.toString());
            currTile.classList.add("shake");
            currTile.addEventListener("animationend", () => {
                currTile.classList.remove("shake");
            })
        }
        return;
    }

    //a variable to keep track of how many correct letters you have
    let correct = 0;

    //creating a map to keep track of how many times each letter appears
    //example:
    //word: puffy
    //map: {P:1, U:1, F:2, Y:1}
    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        //if the letter is on the map, adding one
        if (letterCount[letter]) {
            letterCount[letter] += 1;
        }
        //if it is not, setting it to one
        else {
            letterCount[letter] = 1;
        }
    }

    for (let i = 0; i < width; i++) {
        //getting the current letter of the current tile
        let currTile = document.getElementById(row.toString() + '-' + i.toString());
        let letter = currTile.innerText;

        //checking if won(game over)
        if (correct == width && gameOver === false) {
            gameOver = true;
            win();
        }
        //checking if the letter is correct and in the correct position
        //adding the correct class and flip animation
        setTimeout(() => {
            currTile.classList.add("flip");
            if (word[i] == letter) {
                currTile.classList.add("correct");
                correct += 1;
                letterCount[letter] -= 1;
            }
        }, i * 500 / 2)
        currTile.addEventListener('transitionend', () => {
            currTile.classList.remove("flip");
            //checking if won(game over)
            if (correct == width && gameOver === false) {
                gameOver = true;
                win();
            }
        })

    }

    for (let i = 0; i < width; i++) {
        let currTile = document.getElementById(row.toString() + '-' + i.toString());
        let letter = currTile.innerText;

        //checking if the letter is absent or present
        //adding classes and animations
        setTimeout(() => {
            currTile.classList.add("flip");
            if (!currTile.classList.contains("correct")) {
                if (word.includes(letter) && letterCount[letter] > 0) {
                    currTile.classList.add("present");
                    letterCount[letter] -= 1;
                }
                else {
                    currTile.classList.add("absent");
                }
            }
        }, i * 500 / 2)

        currTile.addEventListener('transitionend', () => {
            currTile.classList.remove("flip");
        })

    }

    row += 1;
    col = 0;
}

function win() {
    document.getElementById("answer").innerText = "Correct!";
    copyResult();
}

function copyResult() {
    let score = "";

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < width; j++) {
            let currTile = document.getElementById(i.toString() + '-' + j.toString());
            if (currTile.classList.contains("correct")) {
                score += "🟩";
            } else if (currTile.classList.contains("present")) {
                score += "🟨";
            } else if (currTile.classList.contains("absent")) {
                score += "⬜";
            }
        }
        score += "\n";
    }
    console.log(score);
    navigator.clipboard.writeText(score);
}