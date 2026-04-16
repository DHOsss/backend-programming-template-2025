const gachaRepository = require('./gacha-repository');

const MAX_DAILY_ATTEMPTS = 5;

async function playGacha(userId) {
  const todayAttempts = await gachaRepository.countTodayAttempts(userId);
  if (todayAttempts >= MAX_DAILY_ATTEMPTS) {
    return {
      success: false,
      error: 'DAILY_LIMIT_REACHED',
      message: `Anda sudah mencapai batas maksimal ${MAX_DAILY_ATTEMPTS} kali gacha hari ini. Silakan coba lagi besok.`,
    };
  }

  const availablePrizes = await gachaRepository.getAvailablePrizes();

  const winChance = Math.random();
  let result = 'lose';
  let wonPrize = null;

  if (winChance < 0.3 && availablePrizes.length > 0) {
    const weights = availablePrizes.map((prize) => {
      const remaining = prize.quota - prize.winnersCount;
      return remaining;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let randomWeight = Math.random() * totalWeight;

    for (let i = 0; i < availablePrizes.length; i++) {
      randomWeight -= weights[i];
      if (randomWeight <= 0) {
        wonPrize = availablePrizes[i];
        break;
      }
    }

    if (wonPrize) {
      result = 'win';
      await gachaRepository.incrementWinnersCount(wonPrize._id);
    }
  }

  const history = await gachaRepository.createHistory(
    userId,
    result,
    wonPrize ? wonPrize._id : null,
    wonPrize ? wonPrize.name : null
  );

  return {
    success: true,
    result,
    prize: wonPrize ? wonPrize.name : null,
    attemptsToday: todayAttempts + 1,
    attemptsRemaining: MAX_DAILY_ATTEMPTS - (todayAttempts + 1),
    history,
  };
}

async function getHistory(userId) {
  return gachaRepository.getHistoryByUserId(userId);
}

async function getPrizes() {
  const prizes = await gachaRepository.getPrizes();
  return prizes.map((prize) => ({
    id: prize._id,
    name: prize.name,
    quota: prize.quota,
    winnersCount: prize.winnersCount,
    remainingQuota: prize.quota - prize.winnersCount,
  }));
}

function maskName(name) {
  if (!name) return '***';

  const chars = name.split('');
  const maskedChars = chars.map((char, index) => {
    if (char === ' ') return ' ';
    if (Math.random() < 0.5) {
      return '*';
    }
    return char;
  });

  let hasVisible = maskedChars.some((c) => c !== '*' && c !== ' ');
  let hasMasked = maskedChars.some((c) => c === '*');

  if (!hasVisible && chars.length > 0) {
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] !== ' ') {
        maskedChars[i] = chars[i];
        break;
      }
    }
  }

  if (!hasMasked && chars.length > 1) {
    const nonSpaceIndices = chars
      .map((c, i) => (c !== ' ' ? i : -1))
      .filter((i) => i >= 0);
    if (nonSpaceIndices.length > 1) {
      const randomIndex =
        nonSpaceIndices[Math.floor(Math.random() * nonSpaceIndices.length)];
      maskedChars[randomIndex] = '*';
    }
  }

  return maskedChars.join('');
}

async function getWinners() {
  const winners = await gachaRepository.getAllWinners();
  return winners.map((entry) => ({
    prizeName: entry.prizeName,
    winnerName: entry.userId ? maskName(entry.userId.fullName) : '***',
    wonAt: entry.createdAt,
  }));
}

async function seedPrizes() {
  return gachaRepository.seedPrizes();
}

module.exports = {
  playGacha,
  getHistory,
  getPrizes,
  getWinners,
  seedPrizes,
};
