const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Map(); // Храним подключенных клиентов

server.on('connection', (ws) => {
    console.log('A new client connected');

    ws.on('message', (message) => {
        console.log('received: %s', message);
        const data = JSON.parse(message);

        // Сохраняем или обновляем информацию о клиенте
        clients.set(ws, { nickname: data.from });

        // Отправка сообщения только конкретному получателю
        server.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });

        // Обновляем состояние подключения для всех клиентов
        updateOnlineClients();
    });

    ws.on('close', () => {
        console.log('A client disconnected');
        clients.delete(ws); // Удаляем клиента из списка
        updateOnlineClients(); // Обновляем список онлайн пользователей
    });
});

function updateOnlineClients() {
    const onlineClients = Array.from(clients.values()).map(client => client.nickname);
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'onlineUsers', users: onlineClients }));
        }
    });
}

console.log('Server is running on ws://localhost:8080');
