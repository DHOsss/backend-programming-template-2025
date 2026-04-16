const express = require('express');

const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  route.get('/prizes', gachaController.getPrizes);

  route.get('/winners', gachaController.getWinners);

  route.get('/history', gachaController.getHistory);

  route.post('/', gachaController.playGacha);
};
