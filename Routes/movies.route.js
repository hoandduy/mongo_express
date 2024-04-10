const express = require('express')
const {
	getAllMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
	getHighestRated,
} = require('../Controllers/movies.controller')

const router = express.Router()

router.route('/highest-rated').get(getHighestRated, getAllMovies)

router.route('/')
	.get(getAllMovies)
	.post(createMovie)

router.route('/:id')
	.get(getMovie)
	.patch(updateMovie)
	.delete(deleteMovie)

module.exports = router
