// src/app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const credentialRoutes = require('./routes/credentialRoutes');

const app = express();
const port = 3000;

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log('MongoDB 연결 성공'))
   .catch((error) => console.error('MongoDB 연결 실패:', error));

app.use(express.json());

// API 라우트 설정
app.use('/api', credentialRoutes);

app.listen(port, () => {
   console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
