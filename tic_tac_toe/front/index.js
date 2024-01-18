let ws = new WebSocket('ws://localhost:8080');

let symbol = null;
let turn = null;
let isGameActive = false;

const messageElement = document.querySelector('.message');

ws.onmessage = (message) => {
    const responce = JSON.parse(message.data);
    
    if(responce.method === 'join'){
        symbol = responce.symbol;
        turn = responce.turn;
        isGameActive = symbol === turn;

        updateMessage();
    }
}

function updateMessage () {
    if(isGameActive){
        messageElement.textContent = 'move'
    }else{
        messageElement.textContent = `waiting ${turn}...`
    }
}