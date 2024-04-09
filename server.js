const mongoose = require('mongoose')
require('dotenv').config()
const app = require('./app')
const port = process.env.PORT || 3000

mongoose
	.connect(process.env.CONN_STR, {
		authSource: 'admin',
		user: process.env.USER,
		pass: process.env.PASSWORD,
	})
	.then(_conn => {
		// console.log("🚀 ~ conn:", conn)
		console.log('DB connect successfully')

		app.listen(port, () => {
			console.log(`Ser has started on port ${port}`)
		})
	})
	.catch(err => {
		console.log(err)
		console.log('Something went wrong')
	})
