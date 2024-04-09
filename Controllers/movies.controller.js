const Movie = require('../Models/movies.model')

const getAllMovies = async (req, res) => {
	try {
		console.log(req.query)
		const movies = await Movie.find(req.query)
		// const movies = await Movie.find()
		// 	.where('duration')
		// 	.equals(req.query.duration)
		// 	.where('releaseYear')
		// 	.equals(req.query.releaseYear)

		res.status(200).json({
			status: 'success',
			total: movies.length,
			data: {
				movies,
			},
		})
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error.message,
		})
	}
}

const getMovie = async (req, res) => {
	try {
		// const movie = await Movie.find({ _id: req.params.id})
		const movie = await Movie.findById(req.params.id)
		res.status(200).json({
			status: 'success',
			data: {
				movie,
			},
		})
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error.message,
		})
	}
}

const createMovie = async (req, res) => {
	try {
		const movie = await Movie.create(req.body)
		console.log(movie)
		res.status(201).json({
			status: 'success',
			data: {
				movie,
			},
		})
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error.message,
		})
	}
}

const updateMovie = async (req, res) => {
	try {
		const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		})
		console.log(movie)
		res.status(200).json({
			status: 'success',
			data: {
				movie,
			},
		})
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error.message,
		})
	}
}

const deleteMovie = async (req, res) => {
	try {
		await Movie.findByIdAndDelete(req.params.id)
		res.status(204).json()
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error.message,
		})
	}
}

module.exports = {
	getAllMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
}
