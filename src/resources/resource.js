export default function resource(path) {
  return client => (
    {
      path,
      client,

      findAll({ filter = null,
                orderBy = null, top = 400, skip = 0 } = {}) {
        client.logger.info('findAll', { path: this.path, filter, orderBy, top, skip });
        return client.get(this.path, { $filter: filter, $orderby: orderBy, $top: top, $skip: skip })
                     .then(response => response);
      },

      findOne(...args) {
        client.logger.info('findOne', { path: this.path, args });

        return this.findAll(...args).then(items => items[0]);
      },

      findById(id) {
        client.logger.info('findById', { path: this.path, id });
        return client.get(`${this.path}/${id}`);
      },

      get(...args) { return this.findbyId(...args); },

      create(params = {}) {
        client.logger.info('create', { path: this.path, params });
        return client.post(this.path, params);
      },

      destroy(id) {
        client.logger.info('destroy', { path: this.path, id });
        return client.delete(`${this.path}/${id}`);
      },

      update(id, params = {}) {
        client.logger.info('update', { path: this.path, id, params });
        return client.put(`${this.path}/${id}`, params);
      },
    }
  );
}
