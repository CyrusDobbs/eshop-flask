import os

from flask import Blueprint, render_template, request, redirect, send_file
from flask import current_app

from config import collection_ext

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return redirect("/shop/")


@main.route('/about/')
def about():
    return render_template('about.html')


@main.route('/shop/')
def shop():
    collection = request.args.get('collection')

    items_curser = current_app.db.items.find()

    if collection:
        items = [item for item in items_curser if item['collection'] == collection]
        collection = collection_ext[collection]
    else:
        items = [item for item in items_curser]
        collection = "Shop"

    for item in items:
        item['_id'] = str(item['_id'])

    return render_template('shop.html', items=items, collection=collection)


@main.route('/img/<img_id>')
def get_img(img_id):
    filename = os.path.join("static/img", f"{img_id}.jpg")
    return send_file(filename, mimetype='image/jpeg')


@main.route('/contact/')
def contact():
    return render_template('contact.html')
