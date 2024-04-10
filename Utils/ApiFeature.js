class ApiFeature {
	constructor(query, queryStr) {
		this.query = query
		this.queryStr = queryStr
	}

	filter() {
		let queryString = JSON.stringify(this.queryStr)
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			match => `$${match}`,
		)
		const queryObj = { ...JSON.parse(queryString) }

		const excludeFields = ['sort', 'page', 'limit', 'fields']
		excludeFields.forEach(el => {
			delete queryObj[el]
		})

		this.query = this.query.find(queryObj)

    return this
	}

  sort() {
		const sortQuery = this.queryStr.sort
		if (sortQuery) {
			const sortBy = sortQuery.split(',').join(' ')
			this.query = this.query.sort(sortBy)
		} else {
			this.query = this.query.sort('-createdAt')
		}

		return this
  }

	limitFields() {
		const selectField = this.queryStr.fields
		if (selectField) {
			const select = selectField.split(',').join(' ')
			this.query = this.query.select(select)
		} else {
			this.query = this.query.select('-__v')
		}

		return this
	}

	async paginate() {
		const page = this.queryStr.page * 1 || 1
		const limit = this.queryStr.limit * 1 || 10
		const skip = (page - 1) * limit
		this.query = this.query.skip(skip).limit(limit)

		// if (this.queryStr.page) {
		// 	const moviesCounts = await Movie.countDocuments()
		// 	if (skip >= moviesCounts) {
		// 		throw new Error('This page is not found')
		// 	}
		// }
		return this
	}
}

module.exports = ApiFeature
