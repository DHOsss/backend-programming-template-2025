const gachaService = require('./gacha-service');
const usersRepository = require('../users/users-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { passwordMatched } = require('../../../utils/password');

async function playGacha(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'Email and password are required'
      );
    }

    const user = await usersRepository.getUserByEmail(email);
    if (!user) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Email not found'
      );
    }

    const isPasswordCorrect = await passwordMatched(password, user.password);
    if (!isPasswordCorrect) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong password'
      );
    }

    const result = await gachaService.playGacha(user._id);

    if (!result.success) {
      throw errorResponder(errorTypes.FORBIDDEN, result.message);
    }

    return response.status(200).json({
      statusCode: 200,
      message:
        result.result === 'win'
          ? `Selamat! Anda memenangkan ${result.prize}!`
          : 'Maaf, Anda tidak memenangkan hadiah kali ini.',
      data: {
        result: result.result,
        prize: result.prize,
        attemptsToday: result.attemptsToday,
        attemptsRemaining: result.attemptsRemaining,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'Email and password are required'
      );
    }

    const user = await usersRepository.getUserByEmail(email);
    if (!user) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Email not found'
      );
    }

    const isPasswordCorrect = await passwordMatched(password, user.password);
    if (!isPasswordCorrect) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong password'
      );
    }

    const history = await gachaService.getHistory(user._id);

    return response.status(200).json({
      statusCode: 200,
      message: 'Gacha history retrieved successfully',
      data: history,
    });
  } catch (error) {
    return next(error);
  }
}

async function getPrizes(request, response, next) {
  try {
    const prizes = await gachaService.getPrizes();

    return response.status(200).json({
      statusCode: 200,
      message: 'Prizes list retrieved successfully',
      data: prizes,
    });
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinners();

    return response.status(200).json({
      statusCode: 200,
      message: 'Winners list retrieved successfully',
      data: winners,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  playGacha,
  getHistory,
  getPrizes,
  getWinners,
};
