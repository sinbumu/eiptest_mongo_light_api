// routes/claimsRoutes.js

const express = require('express');
const Claim = require('../models/Claim');
const bcrypt = require('bcrypt');
const router = express.Router();

// Claim 저장 API (기존 코드 유지)
router.post('/claims', async (req, res) => {
    const { Claim: claimData, password, claimKey } = req.body;

    // 필수값 검사
    if (!claimData || !claimKey) {
        return res.status(400).json({ error: 'Claim과 claimKey는 필수값입니다.' });
    }

    try {
        // Claim 문서 생성
        const newClaim = new Claim({
            claimKey,
            Claim: claimData,
            password
        });

        // MongoDB에 저장
        await newClaim.save();

        res.status(201).json({ message: 'Claim 저장 성공' });
    } catch (error) {
        console.error(error);

        // claimKey 중복 시 에러 처리
        if (error.code === 11000) {
            return res.status(409).json({ error: '이미 존재하는 claimKey입니다.' });
        }

        res.status(500).json({ error: '서버 오류로 인해 저장에 실패했습니다.' });
    }
});

// Claim 조회 API (기존 코드 유지)
router.get('/claims', async (req, res) => {
    const { claimKey, password } = req.query;

    // 필수값 검사
    if (!claimKey) {
        return res.status(400).json({ error: 'claimKey는 필수값입니다.' });
    }

    try {
        const claimDoc = await Claim.findOne({ claimKey });

        if (!claimDoc) {
            return res.status(404).json({ error: '해당 claimKey에 대한 Claim이 없습니다.' });
        }

        // 비밀번호 검증
        if (claimDoc.password && password) {
            const isPasswordValid = await bcrypt.compare(password, claimDoc.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
            }
        } else if (claimDoc.password && !password) {
            return res.status(401).json({ error: '비밀번호가 필요합니다.' });
        }

        // 비밀번호 필드 제거
        const { password: _, _id, __v, ...filteredClaim } = claimDoc.toObject();

        res.status(200).json(filteredClaim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류로 인해 조회에 실패했습니다.' });
    }
});

// 1. Claim 수정 API 추가
router.put('/claims', async (req, res) => {
    const { claimKey, newClaim } = req.body;

    // 필수값 검사
    if (!claimKey || !newClaim) {
        return res.status(400).json({ error: 'claimKey와 newClaim은 필수값입니다.' });
    }

    try {
        // Claim 문서 찾기
        const claimDoc = await Claim.findOne({ claimKey });

        if (!claimDoc) {
            return res.status(404).json({ error: '해당 claimKey에 대한 Claim이 없습니다.' });
        }

        // 비밀번호 검증 (시연용이므로 생략하거나 비활성화 가능)
        // 여기서는 비밀번호 없이도 수정 가능하도록 합니다.

        // Claim 데이터 수정
        claimDoc.Claim = newClaim;

        // 수정된 Claim 저장
        await claimDoc.save();

        res.status(200).json({ message: 'Claim 수정 성공', claimKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 오류로 인해 수정에 실패했습니다.' });
    }
});

module.exports = router;
