import os
from pathlib import Path

from bson import ObjectId
from flask import session, redirect, url_for, request, flash, current_app, render_template, Blueprint

from main import shop

administration = Blueprint('administration', __name__)


@administration.before_request
def check_admin():
    if not session.get('username') or session.get('username') not in current_app.config['ADMINS']:
        return redirect(url_for('auth.login'))
    else:
        pass


@administration.route('/admin/')
def admin():
    return render_template('admin.html')


@administration.route('/additem', methods=['POST'])
def add_item():
    if 'image' not in request.files:
        flash('No file part')
        return redirect(url_for('main.admin'))

    file = request.files['image']

    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('main.admin'))

    form = request.form
    name = form.get('name')
    desc = form.get('desc').replace("\r\n", "\n")
    collection = form.get('collection')
    price = round(float(form.get('price')), 2)

    current_app.db.items.insert_one({'name': name,
                                     'desc': desc,
                                     'collection': collection,
                                     'price': price,
                                     'sold': False,
                                     'hidden': False})

    item = current_app.db.items.find_one({'name': name,
                                          'desc': desc,
                                          'collection': collection,
                                          'price': price,
                                          'sold': False,
                                          'hidden': False})

    if file and allowed_file(file.filename):
        file.save(
            os.path.join(current_app.root_path, 'static', 'img', str(item['_id']) + "." + file.filename.rsplit('.', 1)[1].lower()))

    return render_template('admin.html')


@administration.route('/sold/<item_id>')
def item_sold(item_id):
    item_identifier = {"_id": ObjectId(item_id)}
    item = current_app.db.items.find_one(item_identifier)
    current_app.db.items.update_one(item_identifier, {"$set": {'sold': not item['sold']}})
    return shop()


@administration.route('/hide/<item_id>')
def item_hide(item_id):
    item_identifier = {"_id": ObjectId(item_id)}
    item = current_app.db.items.find_one(item_identifier)
    current_app.db.items.update_one(item_identifier, {"$set": {'hidden': not item['hidden']}})
    return shop()


@administration.route('/delete/<item_id>')
def item_delete(item_id):
    item_identifier = {"_id": ObjectId(item_id)}
    current_app.db.items.delete_one(item_identifier)
    for filename in Path(os.path.join(current_app.static_folder, 'img')).glob(f"{item_id}.*"):
        filename.unlink()
    return shop()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['jpg', 'png']
