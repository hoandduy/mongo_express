const Movie = require('../Models/movies.model')
const ApiFeature = require('../Utils/ApiFeature')

const getHighestRated = (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratings'

	next()
}

const getAllMovies = async (req, res) => {
	try {
		const feature = new ApiFeature(Movie.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate()

		const movies = await feature.query
		console.log('🚀 ~ getAllMovies ~ movies:', movies)

		// console.log(query)

		// SORTING LOGIC
		// const sortQuery = req.query.sort
		// if (sortQuery) {
		// 	const sortBy = sortQuery.split(',').join(' ')
		// 	query = query.sort(sortBy)
		// } else {
		// 	query = query.sort('-createdAt')
		// }

		// LIMITING FIELDS
		// const selectField = req.query.fields
		// if (selectField) {
		// 	const select = selectField.split(',').join(' ')
		// 	console.log(select)
		// 	query = query.select(select)
		// } else {
		// 	query = query.select('-__v')
		// }

		// PAGINATION
		// const page = req.query.page * 1 || 1
		// const limit = req.query.limit * 1 || 10
		// const skip = (page - 1) * limit
		// query = query.skip(skip).limit(limit)

		// if (req.query.page) {
		// 	const moviesCounts = await Movie.countDocuments()
		// 	if (skip >= moviesCounts) {
		// 		throw new Error('This page is not found')
		// 	}
		// }

		// const movies = await query
		// console.log(movies)
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
	getHighestRated,
}
