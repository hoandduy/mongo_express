const express = require('express')
const {
	getAllMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
} = require('../Controllers/movies.controller')

const router = express.Router()

router.route('/')
	.get(getAllMovies)
	.post(createMovie)

router.route('/:id')
	.get(getMovie)
	.patch(updateMovie)
	.delete(deleteMovie)

module.exports = router
