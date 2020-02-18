module.exports = {
  PORT: 9999,
  CORS: {
		ALLOW_ORIGIN: '*',
		ALLOW_METHODS: 'PUT,POST,GET,DELETE,OPTIONS,HEAD',
		ALLOW_HEADERS: 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Accept',
		ALLOW_CREDENTIALS: true
  }
}
