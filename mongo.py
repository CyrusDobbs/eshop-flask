from bson import ObjectId
from flask import current_app, Blueprint, jsonify, request

mongo = Blueprint("mongo", __name__)


@mongo.route("/get_items")
def get_items():
    collection = request.args.get('collection')

    items_curser = current_app.db.items.find()

    if collection and collection != "all":
        items = [item for item in items_curser if item['collection'] == collection]
    else:
        items = [item for item in items_curser]

    for item in items:
        item['_id'] = str(item['_id'])

    return jsonify(items)


@mongo.route("/get_item/<item_id>")
def get_item(item_id):
    item_identifier = {"_id": ObjectId(item_id)}
    item = current_app.db.items.find_one(item_identifier)
    item['_id'] = str(item['_id'])
    return jsonify(item)
