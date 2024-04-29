const CustomerError = require('../Utils/CustomError')

const devErrors = (res, error) => {
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
		stackTrace: error.stack,
		error: error,
	})
}

const castErrorHandler = (err) => {
	const msg = `Invalid value ${err?.value} for field ${err.path}!`
	return new CustomerError(msg, 400)	
}

const duplicateKeyHandler = (err) => {
	const name = err.keyValue.name
	const msg = `Already a movie with name '${name}'`
	return new CustomerError(msg, 400)
}

const validationErrorHandler = (err) => {
	const errorsMsg = Object.values(err.errors).map(val => val.message)
	const errMsgStr = errorsMsg.join('. ')
	const msg = `Invalid input data: ${errMsgStr}`

	return new CustomerError(msg, 400)
}

const prodErrors = (res, error) => {
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		})
	} else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

module.exports = (error, req, res, next) => {
	error.statusCode = error.statusCode || 500
	error.status = error.status || 'error'

	if (process.env.NODE_ENV === 'development') {
		devErrors(res, error)
	} else if (process.env.NODE_ENV === 'production') {
		let err = JSON.parse(JSON.stringify(error))

		if (err.name === 'CastError') {
			err = castErrorHandler(err)
		}
		if (err.code === 11000) {
			err = duplicateKeyHandler(err)
		}
		if (err.name === 'ValidationError') {
			err = validationErrorHandler(err)
		}
		prodErrors(res, err)
	}
}
