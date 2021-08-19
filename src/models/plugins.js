const paginate = (schema) => {
  /**
   * @param {Object} [filter] - Mongo filter
   * @param {string} [options.sort] - Format criteria: sortField:(desc|asc). Multiple criterias be separated by (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   */
  schema.statics.paginate = async function (filter, options) {
    let sort = '';
    if (options.sort) {
      const sortingCriteria = [];
      options.sort.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = '-createdAt';
    }

    const limit = options.limit && +options.limit > 0 ? +options.limit : 10;
    const page = options.page && +options.page > 0 ? +options.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const result = {
        results,
        page,
        limit,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = { paginate };
