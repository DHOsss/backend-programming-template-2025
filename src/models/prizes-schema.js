module.exports = (db) =>
  db.model(
    'Prizes',
    db.Schema({
      name: String,
      quota: Number,
      winnersCount: { type: Number, default: 0 },
    })
  );
