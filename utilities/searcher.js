const searcherObject = (config) => {
    this.config = config
    return {
        default: {
            filter: {
                $eq: [],
                $iLike: [],
            },
            sorter: {
                $by: 'sortBy',
                $dir: 'sortDirection',
            },
            pager: {
                $skip: 'skip',
                $limit: 'limit',
            },
        },
        getFilter: (params) => {
            const filter = this.config.filter
            const result = {}
            for (const key of filter.$eq) {
                if (params[key] !== undefined) {
                    result[key] = params[key]
                }
            }
            for (const key of filter.$iLike) {
                if (params[key] !== undefined) {
                    result[key] = { $regex: new RegExp(params[key], 'i') }
                }
            }
            return result
        },
        getSorter: (params) => {
            const sorter = this.config.sorter
            return {
                [params[sorter.$by] || '_id']: params[sorter.$dir] === 'asc' ? 1 : -1,
            }
        },
        getPager: (params) => {
            const pager = this.config.pager
            return {
                skip: params[pager.$skip] || 0,
                limit: params[pager.$limit] || 25,
            }
        },
    }
}
module.exports = searcherObject
