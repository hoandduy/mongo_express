const Movie = require('../Models/movies.model')
const ApiFeature = require('../Utils/ApiFeature')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')

const getHighestRated = (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratings'

	next()
}

const getAllMovies = asyncErrorHandler(async (req, res) => {
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
})

const getMovie = asyncErrorHandler(async (req, res) => {
	// const movie = await Movie.find({ _id: req.params.id})
	const movie = await Movie.findById(req.params.id)
	res.status(200).json({
		status: 'success',
		data: {
			movie,
		},
	})
})


const createMovie = asyncErrorHandler(async (req, res) => {
	const movie = await Movie.create(req.body)
	console.log(movie)
	res.status(201).json({
		status: 'success',
		data: {
			movie,
		},
	})
})

const updateMovie = asyncErrorHandler(async (req, res) => {
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
})

const deleteMovie = asyncErrorHandler(async (req, res) => {
	await Movie.findByIdAndDelete(req.params.id)
	res.status(204).json()
})

const getMovieStats = asyncErrorHandler(async (req, res) => {
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
		// {
		// 	$match: {
		// 		maxPrice: {
		// 			$gte: 60,
		// 		},
		// 	},
		// },
	])

	res.status(200).json({
		status: 'success',
		total: stats.length,
		data: {
			stats,
		},
	})
})

const getMovieByGenre = asyncErrorHandler(async (req, res) => {
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
})

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
