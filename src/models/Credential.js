const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
   uri: {
      type: String,
      required: true
   },
   tokenId: {
      type: String,
      required: true,
      unique: true,
      index: true
   },
   ItokenId: {  // pTokenId를 ItokenId로 변경
      type: String,
      default: null
   },
   Claim: {  // credential을 Claim으로 수정
      type: Object,
      required: true
   },
   password: {
      type: String,
      default: null
   },
   to: {  // to 필드 추가
      type: String,
      required: true
   },
   issuanceTime: {  // 발급 시각 필드 추가
      type: Number,
      required: true
   },
   expirationTime: {  // 만료 시각 필드 추가
      type: Number,
      required: true
   },
   optionalData: {  // 추가 데이터 필드 추가
      type: String,
      default: null
   },
   isDeleted: {  // 논리 삭제 여부
      type: Boolean,
      default: false
   }
});

module.exports = mongoose.model('Credential', credentialSchema);
