let ws = new WebSocket('ws://localhost:8080');

let symbol = null;
let turn = null;
let isGameActive = false;

const boardElement = document.querySelector('.board');
const messageElement = document.querySelector('.message');
const cellElements = document.querySelectorAll('.cell');
const scoreElement = document.querySelector('.score');
let fields = ['', '', '', '', '', '', '', '', ''];

ws.onmessage = (message) => {
    const responce = JSON.parse(message.data);
    
    if(responce.method === 'join'){
        symbol = responce.symbol;
        turn = responce.turn;
        isGameActive = symbol === turn;

        scoreElement.textContent = 'Score: 0 - 0'

        updateMessage();
    }

    if(responce.method === 'update'){
        fields = responce.fields;
        turn = responce.turn;
        isGameActive = symbol === turn;

        updateBoard();
        updateMessage();
    }

    if(responce.method === 'result'){
        fields = responce.fields;
        updateBoard();
        isGameActive = false;
        
        let winLineDiv = document.createElement('div');
        winLineDiv.className = responce.winLine;

        setTimeout(() => {
            boardElement.appendChild(winLineDiv);
            messageElement.textContent = responce.message === symbol ? 'You win' : 'You lose';
        }, 100);
    }

    if(responce.method === 'left'){
        isGameActive = false;
        messageElement.textContent = responce.message;
    }
}

function updateMessage () {
    if(isGameActive){
        messageElement.textContent = 'move'
    }else{
        messageElement.textContent = `waiting ${turn}...`
    }
}

cellElements.forEach((cell, index) => {
    cell.addEventListener('click', event => {
        makeMove(event.target, index);
    })
});

function makeMove(cell, index) {
    if(!isGameActive || fields[index] !== '') return;

    isGameActive = false;
    cell.classList.add(symbol);
    fields[index] = symbol;

    ws.send(JSON.stringify({
        method: 'move',
        symbol: symbol,
        fields: fields
    }))
}

function updateBoard() {
    cellElements.forEach((cell, index) => {
        cell.classList.remove('X', 'O');
        fields[index] !== '' && cell.classList.add(fields[index]);
    })
} 