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
   pTokenId: {
      type: String,
      default: null
   },
   credential: {
      type: Object,
      required: true
   },
   password: {
      type: String,
      default: null
   },
   isDeleted: {  // 논리 삭제 여부 추가
      type: Boolean,
      default: false
   }
});

module.exports = mongoose.model('Credential', credentialSchema);
