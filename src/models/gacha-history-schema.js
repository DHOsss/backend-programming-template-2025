module.exports = (db) =>
  db.model(
    'GachaHistory',
    db.Schema(
      {
        userId: {
          type: db.Schema.Types.ObjectId,
          ref: 'Users',
          required: true,
        },
        prizeId: {
          type: db.Schema.Types.ObjectId,
          ref: 'Prizes',
          default: null,
        },
        prizeName: { type: String, default: null },
        result: {
          type: String,
          enum: ['win', 'lose'],
          required: true,
        },
      },
      {
        timestamps: true,
      }
    )
  );
