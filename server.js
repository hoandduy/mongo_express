const mongoose = require('mongoose')
require('dotenv').config()
const app = require('./app')
const port = process.env.PORT || 3000

mongoose
	.connect(process.env.CONN_STR, {
		authSource: 'admin',
		user: process.env.DB_USER_NAME,
		pass: process.env.DB_PASSWORD,
	})
	.then(_conn => {
		// console.log("🚀 ~ conn:", conn)
		console.log('DB connect successfully')
	})

const server = app.listen(port, () => {
	console.log(`Ser has started on port ${port}`)
})

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message)
	console.log('Unhandled Rejection occurred! Shutting down...')

	server.close(() => {
		process.exit(1)
	})
})
