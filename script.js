const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message');
const nicknameInput = document.getElementById('nickname');
const recipientInput = document.getElementById('recipient');
const messagesContainer = document.querySelector('.messages');

const socket = new WebSocket('ws://localhost:8080');

// Установка ника при открытии соединения
socket.addEventListener('open', () => {
    const nickname = nicknameInput.value.trim();
    if (nickname) {
        socket.send(JSON.stringify({ nickname }));
    }
});

// Обработчик для получения сообщений от сервера
socket.addEventListener('message', (event) => {
    const { from, text } = JSON.parse(event.data); // Декодируем сообщение
    const messageElement = document.createElement('div');
    messageElement.className = 'message incoming'; // Входящее сообщение
    messageElement.innerText = `${from}: ${text}`; // Отображаем текст сообщения
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Прокрутка вниз
});

// Обработчик для отправки сообщения
sendButton.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    const recipient = recipientInput.value.trim();
    const messageText = messageInput.value.trim();

    if (nickname && recipient && messageText) {
        const message = JSON.stringify({ nickname, recipient, text: messageText }); // Форматирование сообщения
        socket.send(message); // Отправляем сообщение на сервер

        // Добавляем исходящее сообщение
        const outgoingMessageElement = document.createElement('div');
        outgoingMessageElement.className = 'message outgoing'; // Исходящее сообщение
        outgoingMessageElement.innerHTML = `<strong>Ты отправил ${recipient}:</strong> ${messageText}`;
        messagesContainer.appendChild(outgoingMessageElement);

        messageInput.value = ''; // Очищаем поле ввода
        recipientInput.value = ''; // Очищаем поле получателя
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Прокрутка вниз
    }
});
