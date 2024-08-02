module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  dialect: process.env.dialect,
  pool: {
    max: +process.env.POOL_MAX,
    min: +process.env.POOL_MIN,
    acquire: +process.env.POOL_ACQUIRE,
    idle: +process.env.POOL_IDLE,
  },
}
