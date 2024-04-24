const mongoose = require('mongoose')
const fs = require('fs')
const validator = require('validator')

const MovieSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required field!'],
			unique: true,
			maxlength: [100, 'Movie name must not have more than 100 characters'],
			minlength: [4, 'Movie name must have at least 4 characters'],
			trim: true,

			validate: [validator.isAlpha, "Name should only contain alphabets"]
		},
		description: {
			type: String,
			required: [true, 'Description is required field!'],
			trim: true,
		},
		duration: {
			type: Number,
			required: [true, 'Duration is required field!'],
		},
		ratings: {
			type: Number,
			// min: [1, 'Ratings must be 1.0 or above.'],
			// max: [10, 'Ratings must be 10.0 or below'],
			validate: {
				validator: function (value) {
					return value >= 1 && value <= 10
				},
				message: 'Ratings ({VALUE}) should be above 1 or below 10',
			},
		},
		totalRating: {
			type: Number,
		},
		releaseYear: {
			type: Number,
			required: [true, 'Release year is required field!'],
		},
		releaseDate: {
			type: Date,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		genres: {
			type: [String],
			required: [true, 'Genres year is required field!'],
			// enum: {
			// 	values: [
			// 		'Action',
			// 		'Adventure',
			// 		'Sci-Fi',
			// 		'Thriller',
			// 		'Crime',
			// 		'Drama',
			// 		'Comedy',
			// 		'Romance',
			// 		'Biography',
			// 	],
			// 	message: 'This genre not exit',
			// },
		},
		directors: {
			type: [String],
			required: [true, 'Directors is required field!'],
		},
		coverImage: {
			type: String,
			required: [true, 'Cover image is required field!'],
		},
		actors: {
			type: [String],
			required: [true, 'Actors is required field!'],
		},
		price: {
			type: Number,
			required: [true, 'Price is required field!'],
		},
		createdBy: String,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

MovieSchema.virtual('durationInHours').get(function () {
	return this.duration / 60
})

// Before .save() or .create()
MovieSchema.pre('save', function (next) {
	this.createdBy = 'Duy Hoang'
	next()
})

MovieSchema.post('save', function (doc, next) {
	const content = `A new movie document with name ${doc.name} has been created by  ${doc.createdBy}\n`
	fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, err => {
		console.log(err.message)
	})
	next()
})

MovieSchema.pre(/^find/, function (next) {
	this.find({ releaseDate: { $lte: Date.now() } })
	this.startTime = Date.now()
	next()
})

MovieSchema.post(/^find/, function (docs, next) {
	this.endTime = Date.now()
	const content = `Query took ${
		this.endTime - this.startTime
	} milliseconds to fetch the document(s).\n`
	fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, err => {
		console.log(err.message)
	})
	next()
})

MovieSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } })

	next()
})

const Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie
