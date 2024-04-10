require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const Movie = require('../Models/movies.model')

mongoose
	.connect(process.env.CONN_STR, {
		authSource: 'admin',
		user: process.env.USERNAME,
		pass: process.env.PASSWORD,
	})
	.then(_conn => {
		// console.log("🚀 ~ conn:", conn)
		console.log('DB connect successfully')
	})
	.catch(err => {
		console.log(err)
		console.log('Something went wrong')
	})

const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'))

const delMovies = async () => {
	try {
		await Movie.deleteMany()
		console.log('Data deleted successfully')
	} catch (error) {
		console.log(error.message)
	}
	process.exit()
}

const importMovies = async () => {
	try {
		await Movie.create(movies)
		console.log('Data created successfully')
	} catch (error) {
		console.log(error.message)
	}
	process.exit()
}

const argv = process.argv[2]

if (argv === '--del') {
	delMovies()
} else if (argv === '--import') {
	importMovies()
}
