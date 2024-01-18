const express  = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
// middleware для работы со статическими файлами
app.use(express.static(path.join(__dirname, '..', 'front')));
app.listen(3000);

const httpServer = http.createServer();
const wss = new WebSocket.Server({ server: httpServer });
httpServer.listen(8080);

let countClientId = 0;
const clientConnections = {};
//Массив клиентов, ожидающих начало игры
let clientsIdWaitingMatch = [];
//Связка игроков по id
const opponents = {};

wss.on('connection', connection => {
    //Присваиваем каждому клиенту id
    const clientId = createClientId();
    //Сохраняем соединение для клиента по id
    clientConnections[clientId] = connection;

    //Сопоставляем клиентов
    matchClients(clientId);

    connection.on('message', message => {
        const responce = JSON.parse(message);
        console.log(responce);
    })
})

function createClientId () {
    countClientId++;
    return countClientId;
}

function matchClients (clientId) {
    clientsIdWaitingMatch.push(clientId);

    if(clientsIdWaitingMatch.length < 2) return;

    //Достаем и сохраняем id игроков
    const firstClientId = clientsIdWaitingMatch.shift();
    const secondClientId = clientsIdWaitingMatch.shift();

    opponents[firstClientId] = secondClientId;
    opponents[secondClientId] = firstClientId;

    //Отправляем каждому из игроков сообщение
    clientConnections[firstClientId].send(JSON.stringify({
        method: 'join',
        symbol: 'X',
        turn: 'X'
    }));
    clientConnections[secondClientId].send(JSON.stringify({
        method: 'join',
        symbol: 'O',
        turn: 'X'
    }));
}