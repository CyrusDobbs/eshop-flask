from pathlib import Path

from bson import ObjectId
from flask import Blueprint, render_template, redirect, send_file, current_app, session

from config import collection_int

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return redirect("/shop/")


@main.route('/about/')
def about():
    return render_template('about.html')


@main.route('/shop/')
def shop():
    return render_template('shop.html', collections=collection_int)


@main.route('/item/<item_id>')
def item_screen(item_id):
    item = current_app.db.items.find_one({"_id": ObjectId(item_id)})
    img_ids = [filename.name.split(".")[0] for filename in
               Path(current_app.item_image_folder).glob(f"{item_id}_?.*")]
    item['_id'] = str(item['_id'])
    if not session.get('username') or session.get('username') not in current_app.config['ADMINS']:
        return render_template('item-user.html', item=item, img_ids=img_ids)
    else:
        return render_template('item-admin.html', item=item, img_ids=img_ids, collections=collection_int)


@main.route('/img/<img_id>')
def get_img(img_id):
    try:
        filename = next(
            filename for filename in Path(current_app.item_image_folder).glob(f"{img_id}.*"))
        return send_file(filename, mimetype=f'image/{filename.name.split(".")[1]}')
    except StopIteration:
        return send_file("static/img/missing.png", mimetype=f'image/png')


@main.route('/contact/')
def contact():
    return render_template('contact.html')
