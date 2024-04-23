const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 4242;

// подключение к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'lab4',
    password: 'admin',
    port: 5432,
});

// подключение использования сессий
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({ extended: true }));

// проверка наличия сессии
function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/');
    }
}

// запрет кэширования, чтобы нельзя было попасть с помощью стрелочек в браузере
function preventCaching(req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}

// очистка сессии
function clearSession(req, res, next) {
    req.session.destroy(err => {
        if (err) {
            console.error('Error clearing session:', err);
        }
        next();
    });
}

// user.html (+очистка кэша и доступ только после проверки наличия сессии)
app.get('/user.html', preventCaching, requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'user.html'));
});

// index.html (+очистка сессии)
app.get('/', clearSession, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/request', (req, res) => {
    const langOp = req.body.langOp;
    if (langOp === 'Русский') {
        res.send('<option selected disabled>Выберите слово</option><option value="Вилка">Вилка</option><option value="Самовар">Самовар</option></option><option value="Матрёшка">Матрёшка</option>');
    } else if (langOp === 'Английский') {
        res.send('<option selected disabled>Выберите слово</option><option value="Fork">Fork</option><option value="Spoon">Spoon</option><option value="Beans">Beans</option>');
    } else if (langOp === 'Финский') {
        res.send('<option selected disabled>Выберите слово</option><option value="Metsä">Metsä</option><option value="Moottoripyörä">Moottoripyörä</option><option value="Tölkki">Tölkki</option>');
    }
});

app.post('/auth', (req, res) => {
    const { username, password, button } = req.body;
    console.log('Получен POST-запрос на /auth:', req.body);

    if (!username || username.trim() === '') {
        return res.status(400).json({ success: false, errors: 'Введите логин' });
    }

    if (!password || password.trim() === '') {
        return res.status(400).json({ success: false, errors: 'Введите пароль' });
    }

    if (button === "authButton") {
        // запрос на логин
        pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (error, results) => {
            if (results.rows.length === 1) {
                const user = results.rows[0];
                // сессия для текущего юзера
                req.session.userId = user.id;
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({ success: false, errors: 'Неверное имя пользователя или пароль' });
            }
        });
    } else if (button === "regButton") {
        // запрос на регистрацию
        pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
            if (results.rows.length === 1) {
                res.status(400).json({ success: false, errors: 'Такой пользователь уже существует' });
            } else {
                pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], (error, results) => {
                    res.status(200).json({ success: true });
                });
            }
        });

    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

