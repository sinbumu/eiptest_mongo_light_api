const express = require('express');
const bcrypt = require('bcrypt');
const Credential = require('../models/Credential');
const DocumentHash = require('../models/DocumentHash');

const router = express.Router();

// 1. 새로운 Credential 및 DocumentHash 추가 API
router.post('/credentials', async (req, res) => {
   const { uri, tokenId, ItokenId, Claim, password, hash, to } = req.body;

   try {
      // 이 부분은 Issuer 에서 비밀번호 생성 + 해쉬화 둘다 하는거로
      // 여기선 동일한 bcrypt.hash 함수 + 동일한 salt값으로 나중에 get할때 체크만.
      // 비밀번호 해시화
      // let hashedPassword = null;
      // if (password) {
      //    const saltRounds = 10;
      //    hashedPassword = await bcrypt.hash(password, saltRounds);
      // }

      // Credential 문서 생성
      const newCredential = new Credential({
         uri,
         tokenId,
         ItokenId: ItokenId || null,
         Claim,
         password: password,
         to//mint 할 떄 to address
      });

      // DocumentHash 문서 생성
      const newDocumentHash = new DocumentHash({
         tokenId,
         hash,
      });

      // MongoDB에 저장
      await newCredential.save();
      await newDocumentHash.save();

      res.status(201).json({ message: 'Credential 및 DocumentHash 저장 성공' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: '서버 오류로 인해 저장에 실패했습니다.' });
   }
});

// 논리 삭제 API
router.delete('/credentials/:tokenId', async (req, res) => {
    const { tokenId } = req.params;
 
    try {
       // tokenId에 해당하는 문서를 찾고 논리 삭제
       const credentialDoc = await Credential.findOneAndUpdate(
          { tokenId },
          { isDeleted: true },
          { new: true }
       );
 
       if (!credentialDoc) {
          return res.status(404).json({ error: '해당 tokenId에 대한 Credential이 없습니다.' });
       }
 
       res.status(200).json({ message: '논리 삭제 완료', credential: credentialDoc });
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: '서버 오류로 인해 삭제에 실패했습니다.' });
    }
 });
 
// Credential 조회 API 수정 (isDeleted 체크 추가)
router.get('/credentials', async (req, res) => {
   const { tokenId, password } = req.query;

   try {
      // isDeleted가 false인 경우만 조회
      const credentialDoc = await Credential.findOne({ tokenId, isDeleted: false });

      if (!credentialDoc) {
         return res.status(404).json({ error: '해당 tokenId에 대한 Credential이 없거나 삭제되었습니다.' });
      }

      // 비밀번호가 있을 경우 비교
      if (credentialDoc.password && password) {
         const isPasswordValid = await bcrypt.compare(password, credentialDoc.password);
         if (!isPasswordValid) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
         }
      } else if (credentialDoc.password && !password) {
         return res.status(401).json({ error: '비밀번호가 필요합니다.' });
      }

      // `isDeleted`와 `password` 필드를 제거
      const { isDeleted, password: _, ...filteredCredential } = credentialDoc.toObject();

      res.status(200).json({ credential: filteredCredential });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: '서버 오류로 인해 조회에 실패했습니다.' });
   }
});

 
 module.exports = router;
