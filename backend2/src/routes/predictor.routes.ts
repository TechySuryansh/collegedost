import express from 'express';
import {
    predictByPercentile,
    getPredictionById,
    neetPredict,
    getNeetPredictionById,
    predictRank
} from '../controllers/predictor.controller';

const router = express.Router();

router.post('/predict-by-percentile', predictByPercentile);
router.post('/neet-predict', neetPredict);
router.post('/predict-rank', predictRank);
router.get('/prediction/:id', getPredictionById);
router.get('/neet-prediction/:id', getNeetPredictionById);

export default router;
