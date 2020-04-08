module.exports = app => {
  const collection = app.$collections.index;
  const model = app.$models.index;

  return {
    getCollection: async (app) => {
      return await collection.getCollection(app)
    },
    getModel: async (app) => {
      return await model.getModel(app)
    }
  }
}