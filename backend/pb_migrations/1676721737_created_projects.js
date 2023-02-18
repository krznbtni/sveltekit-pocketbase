migrate((db) => {
  const collection = new Collection({
    "id": "yghjqz1wy1btx0m",
    "created": "2023-02-18 12:02:17.804Z",
    "updated": "2023-02-18 12:02:17.804Z",
    "name": "projects",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3xbez2p1",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 2,
          "max": 64,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "w4fcd5gx",
        "name": "tagline",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 2,
          "max": 64,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "qzduwlog",
        "name": "description",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": 2,
          "max": 512,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bv9dxnto",
        "name": "url",
        "type": "url",
        "required": true,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "7fxlogvg",
        "name": "thumbnail",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "thumbs": [
            "80x80"
          ]
        }
      },
      {
        "system": false,
        "id": "4ucl6fzh",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id = \"\" && @request.auth.id = @request.data.user",
    "updateRule": "@request.auth.id = user",
    "deleteRule": "@request.auth.id = user",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("yghjqz1wy1btx0m");

  return dao.deleteCollection(collection);
})
