function createCrudService(model) {
  return {
    list() {
      return model.findAll();
    },

    get(id) {
      return model.findById(id);
    },

    create(data) {
      return model.create(data);
    },

    update(id, data) {
      return model.update(id, data);
    },

    remove(id) {
      return model.remove(id);
    }
  };
}

module.exports = createCrudService;
