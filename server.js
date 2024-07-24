const express = require('express');
const mysql = require('mysql');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Укажите ваш домен
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// Настройка CORS для Express
app.use(cors({
  origin: 'http://localhost:5173', // Укажите ваш домен
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Добавьте парсер JSON, чтобы Express мог обрабатывать POST-запросы с JSON-телом
app.use(express.json());

// Подключение к базе данных
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'online-chat'
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных', err);
    return;
  }
  console.log('Подключение к базе данных успешно');
});

// WebSockets
io.on('connection', (socket) => {
  console.log('Новое соединение установлено!');

  socket.on('sendMessage', (data) => {
    const { fromUser, toUser, message } = data;

    // Сохранить сообщение в базе данных
    const insertQuery = 'INSERT INTO message (fromUser, toUser, message) VALUES (?, ?, ?)';
    connection.query(insertQuery, [fromUser, toUser, message], (error, results) => {
      if (error) {
        console.error('Ошибка при сохранении сообщения в базу данных', error);
        return;
      }
      console.log('Сообщение сохранено в базе данных: ', message);

      // Отправить сообщение обратно всем клиентам
      io.emit('newMessage', data);
    });
  });
});

// Маршрут для получения сообщений из базы данных
// Маршрут для получения сообщений из базы данных между двумя пользователями
app.get('/messages', (req, res) => {
  const { fromUser, toUser } = req.query;

  if (!fromUser || !toUser) {
    return res.status(400).json({ error: 'Параметры fromUser и toUser обязательны' });
  }

  const query = `
    SELECT * FROM message 
    WHERE (fromUser = ? AND toUser = ?) OR (fromUser = ? AND toUser = ?)
    ORDER BY id ASC
  `;
  connection.query(query, [fromUser, toUser, toUser, fromUser], (error, results) => {
    if (error) {
      console.error('Ошибка выполнения запроса к базе данных', error);
      res.status(500).json({ error: 'Произошла ошибка при получении сообщений из базы данных' });
      return;
    }
    res.json(results);
  });
});

// Маршрут для отправки сообщения в базу данных
app.post('/messages', (req, res) => {
  const { fromUser, toUser, message } = req.body;
  const insertQuery = 'INSERT INTO message (fromUser, toUser, message) VALUES (?, ?, ?)';
  connection.query(insertQuery, [fromUser, toUser, message], (error, results) => {
    if (error) {
      console.error('Ошибка при сохранении сообщения в базу данных', error);
      res.status(500).json({ error: 'Произошла ошибка при сохранении сообщения в базу данных' });
      return;
    }
    res.status(201).json({ id: results.insertId, fromUser, toUser, message });

    // Отправить сообщение через WebSocket
    io.emit('newMessage', { id: results.insertId, fromUser, toUser, message });
  });
});

// Запуск сервера
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
