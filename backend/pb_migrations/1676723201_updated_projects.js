migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yghjqz1wy1btx0m")

  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = @request.data.user"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yghjqz1wy1btx0m")

  collection.createRule = null

  return dao.saveCollection(collection)
})
