const express = require('express')
const {
	getAllMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
	getHighestRated,
	getMovieStats,
	getMovieByGenre,
} = require('../Controllers/movies.controller')

const router = express.Router()

router.route('/highest-rated').get(getHighestRated, getAllMovies)

router.route('/movie-stats').get(getMovieStats)

router.route('/genres/:genre').get(getMovieByGenre)

router.route('/')
	.get(getAllMovies)
	.post(createMovie)

router.route('/:id')
	.get(getMovie)
	.patch(updateMovie)
	.delete(deleteMovie)

module.exports = router

