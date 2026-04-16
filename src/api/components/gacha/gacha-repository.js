const { GachaHistory } = require('../../../models');
const { Prizes } = require('../../../models');

async function getHistoryByUserId(userId) {
  return GachaHistory.find({ userId }).sort({ createdAt: -1 });
}

async function countTodayAttempts(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return GachaHistory.countDocuments({
    userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
}

async function createHistory(userId, result, prizeId, prizeName) {
  return GachaHistory.create({
    userId,
    result,
    prizeId: prizeId || null,
    prizeName: prizeName || null,
  });
}

async function getPrizes() {
  return Prizes.find({});
}

async function getPrizeById(id) {
  return Prizes.findById(id);
}

async function incrementWinnersCount(prizeId) {
  return Prizes.updateOne(
    { _id: prizeId },
    { $inc: { winnersCount: 1 } }
  );
}

async function getAvailablePrizes() {
  return Prizes.find({ $expr: { $lt: ['$winnersCount', '$quota'] } });
}

async function getAllWinners() {
  return GachaHistory.find({ result: 'win' })
    .populate('userId', 'fullName email')
    .sort({ createdAt: -1 });
}

async function seedPrizes() {
  const count = await Prizes.countDocuments();
  if (count === 0) {
    await Prizes.insertMany([
      { name: 'Emas 10 gram', quota: 1, winnersCount: 0 },
      { name: 'Smartphone X', quota: 5, winnersCount: 0 },
      { name: 'Smartwatch Y', quota: 10, winnersCount: 0 },
      { name: 'Voucher Rp100.000', quota: 100, winnersCount: 0 },
      { name: 'Pulsa Rp50.000', quota: 500, winnersCount: 0 },
    ]);
  }
}

module.exports = {
  getHistoryByUserId,
  countTodayAttempts,
  createHistory,
  getPrizes,
  getPrizeById,
  incrementWinnersCount,
  getAvailablePrizes,
  getAllWinners,
  seedPrizes,
};
