export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  secret: process.env.SECRET || '',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  sessionDurationTime: parseInt(process.env.SESSION_MAX_DURATION_TIME, 10) || 60000,
  sessionBreakTime: parseInt(process.env.SESSION_BREAK_DURATION_TIME, 10) || 20000,
});
