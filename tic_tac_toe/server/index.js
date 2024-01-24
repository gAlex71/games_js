const express = require('express');
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
let winLineStyle = '';

wss.on('connection', (connection) => {
	//Присваиваем каждому клиенту id
	const clientId = createClientId();
	//Сохраняем соединение для клиента по id
	clientConnections[clientId] = connection;

	//Сопоставляем клиентов
	matchClients(clientId);

	connection.on('message', (message) => {
		const responce = JSON.parse(message);

		if (responce.method === 'move') {
			moveHandler(responce, clientId);
		}
	});

    connection.on('close', () => {
        closeClient(connection, clientId);
    })
});

function createClientId() {
	countClientId++;
	return countClientId;
}

function matchClients(clientId) {
	clientsIdWaitingMatch.push(clientId);

	if (clientsIdWaitingMatch.length < 2) return;

	//Достаем и сохраняем id игроков
	const firstClientId = clientsIdWaitingMatch.shift();
	const secondClientId = clientsIdWaitingMatch.shift();

	opponents[firstClientId] = secondClientId;
	opponents[secondClientId] = firstClientId;

	//Отправляем каждому из игроков сообщение
	clientConnections[firstClientId].send(
		JSON.stringify({
			method: 'join',
			symbol: 'X',
			turn: 'X',
		})
	);
	clientConnections[secondClientId].send(
		JSON.stringify({
			method: 'join',
			symbol: 'O',
			turn: 'X',
		})
	);
}

function moveHandler(responce, clientId) {
	const opponentClientId = opponents[clientId];

	if (checkWin(responce.fields)) {
		[clientId, opponentClientId].forEach((id) => {
			clientConnections[id].send(
				JSON.stringify({
					method: 'result',
					message: responce.symbol,
					fields: responce.fields,
					winLine: winLineStyle
				})
			);
		});
        return;
	}

    if (checkDraw(responce.fields)) {
		[clientId, opponentClientId].forEach((id) => {
			clientConnections[id].send(
				JSON.stringify({
					method: 'result',
					message: 'Draw',
					fields: responce.fields,
					winLine: ''
				})
			);
		});
        return;
	}

	[clientId, opponentClientId].forEach((id) => {
		clientConnections[id].send(
			JSON.stringify({
				method: 'update',
				turn: responce.symbol === 'X' ? 'O' : 'X',
				fields: responce.fields,
			})
		);
	});
}

const winningCombos = [
	{style: 'line horizontal-top', nums: [0, 1, 2]}, {style: 'line horizontal-middle', nums: [3, 4, 5]}, {style: 'line horizontal-bottom', nums: [6, 7, 8]}, //rows
    {style: 'line vertical-left', nums: [0, 3, 6]}, {style: 'line vertical-middle', nums: [1, 4, 7]}, {style: 'line vertical-right', nums: [2, 5, 8]}, //colums
    {style: 'line diagonal-left', nums: [0, 4, 8]}, {style: 'line diagonal-right', nums: [2, 4, 6]} //diagonals
];

function checkWin(fields) {
    // проверяем, есть ли совпадение с выигрышными комбинациями
    return winningCombos.some(({ nums, style }) => {
        const [first, second, thirth] = nums;

        if(fields[first] !== '' && fields[first] === fields[second] && fields[first] === fields[thirth]){
			winLineStyle = style;
			return true;
		}else{
			return false;
		}
    })
}

function checkDraw(fields) {
    //Проверяем, заполнены ли все поля
    return fields.every(symbol => symbol === 'X' || symbol === 'O');
}

function closeClient(connect, clientId) {
    connect.close();

    //Проверяем, находился ли вышедший клиент в очереди
    const isLeftUnmatchedClient = clientsIdWaitingMatch.some(unmatchedClientId => unmatchedClientId === clientId);

    if(isLeftUnmatchedClient){
        clientsIdWaitingMatch = clientsIdWaitingMatch.filter(clientWaiting => clientWaiting !== clientId);
    }else{
        const opponentClientId = opponents[clientId];
        clientConnections[opponentClientId].send(JSON.stringify({
            method: 'left',
            message: 'opponent left game'
        }));
    }
}
