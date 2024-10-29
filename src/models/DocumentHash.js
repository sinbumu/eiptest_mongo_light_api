// src/models/DocumentHash.js
const mongoose = require('mongoose');

const documentHashSchema = new mongoose.Schema({
   tokenId: {
      type: String,
      required: true,
      unique: true,  // 해시 컬렉션에서도 tokenId는 고유하게 설정
      index: true
   },
   hash: {
      type: String,
      required: true  // 해시값은 필수
   }
});

module.exports = mongoose.model('DocumentHash', documentHashSchema);
