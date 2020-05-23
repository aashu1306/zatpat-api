class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.excludedFields = ['page', 'sort', 'limit', 'fields', 'query', 'search']
        let excludedPaths = ['passwordChangedAt', '_id', '__v', 'password']
        this.modelFields = Object.keys(query.schema.paths).filter(el => !excludedPaths.includes(el))
    }

    filter() {
        const queryObj = { ...this.queryString };
        this.excludedFields.forEach(el => delete queryObj[el]);
        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let filterQuery = JSON.parse(queryStr)
        if (this.queryString.hasOwnProperty('search') && this.queryString['search'] !== null) {
            filterQuery["$text"] = { "$search": this.queryString['search'] }
        }
        this.query = this.query.find(filterQuery);
        return this;
    }

    search() {
        const queryObj = { ...this.queryString };
        this.excludedFields.forEach(el => delete queryObj[el]);
        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let filterQuery = JSON.parse(queryStr)
        if (this.queryString.hasOwnProperty('query') && this.queryString['query'] !== null) {
            let queryArray = [];
            this.modelFields.forEach(path => {
                let dataType = this.query.schema.paths[path]["instance"]
                if (dataType === "String" || dataType === "Number") {
                    let input_qry = this.queryString['query']
                    if (dataType === "String") {
                        queryArray.push({ [path]: new RegExp(input_qry) })
                    }
                    if (dataType === "Number" && !isNaN(parseInt(input_qry))) {
                        queryArray.push({ [path]: parseInt(this.queryString['query'], 10) })
                    }
                }
            })
            filterQuery['$or'] = queryArray
        }
        this.query = this.query.find(filterQuery);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
module.exports = APIFeatures;