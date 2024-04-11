const Movie = require('../Models/movies.model')
const ApiFeature = require('../Utils/ApiFeature')

const getHighestRated = (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratings'

	next()
}

const getAllMovies = async (req, res) => {
	try {
		const feature = new ApiFeature(Movie, req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate()

		const movies = await feature.query

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

const getMovieStats = async (req, res) => {
	try {
		const stats = await Movie.aggregate([
			{ $match: { ratings: { $gte: 4.5 } } },
			{
				$group: {
					_id: '$releaseYear',
					argRatings: { $avg: '$ratings' },
					argPrice: { $avg: '$price' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' },
					priceTotal: { $sum: '$price' },
					movieCount: { $sum: 1 },
				},
			},
			{
				$sort: {
					minPrice: 1,
				},
			},
			{
				$match: {
					maxPrice: {
						$gte: 60,
					},
				},
			},
		])

		res.status(200).json({
			status: 'success',
			total: stats.length,
			data: {
				stats,
			},
		})
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error.message,
		})
	}
}

const getMovieByGenre = async (req, res) => {
	try {
		const genre = req.params.genre
		const movies = await Movie.aggregate([
			{ $unwind: '$genres' },
			{
				$group: {
					_id: '$genres',
					movieCount: { $sum: 1 },
					movies: { $push: '$name' },
				},
			},
			{ $addFields: { genre: '$_id' } },
			{ $project: { _id: 0 } },
			{ $sort: { movieCount: -1 } },
			//{$limit: 6}
			{$match: {genre: genre}}
		])

		res.status(200).json({
			status: 'success',
			count: movies.length,
			data: {
				movies,
			},
		})
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message,
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
	getMovieStats,
	getMovieByGenre,
}
