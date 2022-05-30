import os
from pathlib import Path

from bson import ObjectId
from flask import session, redirect, url_for, request, flash, current_app, render_template, Blueprint, jsonify

from config import collection_int

mongo_admin = Blueprint('administration', __name__)


@mongo_admin.before_request
def check_admin():
    if not session.get('username') or session.get('username') not in current_app.config['ADMINS']:
        return redirect(url_for('auth.login'))
    else:
        pass


@mongo_admin.route('/admin/')
def admin():
    return render_template('admin.html', collections=collection_int)


@mongo_admin.route('/additem', methods=['POST'])
def add_one():
    if 'images[]' not in request.files:
        flash('No file part')
        return jsonify(message="failure")

    files = request.files.getlist("images[]")
    form = request.form

    item = {'name': form.get('name'),
            'materials': form.get('materials').replace("\r\n", "\n"),
            'dimensions': form.get('dimensions').replace("\r\n", "\n"),
            'other': form.get('other').replace("\r\n", "\n"),
            'collection': form.get('collection'),
            'price': round(float(form.get('price')), 2),
            'sold': bool(form.get('sold')),
            'hidden': bool(form.get('hidden'))}

    current_app.db.items.insert_one(item)
    item = current_app.db.items.find_one(item)

    if files:
        for idx, file in enumerate(files):
            if allowed_file(file.filename):
                file.save(
                    os.path.join(current_app.root_path, 'static', 'img',
                                 str(item['_id']) + f"_{idx}" + "." + file.filename.rsplit('.', 1)[1].lower()))
    return redirect("/admin")


@mongo_admin.route('/updateitem', methods=['POST'])
def update_one():
    form = request.form

    item = {'name': form.get('name'),
            'materials': form.get('materials').replace("\r\n", "\n"),
            'dimensions': form.get('dimensions').replace("\r\n", "\n"),
            'other': form.get('other').replace("\r\n", "\n"),
            'collection': form.get('collection'),
            'price': round(float(form.get('price')), 2),
            'sold': bool(form.get('sold')),
            'hidden': bool(form.get('hidden'))}

    current_app.db.items.find_one_and_update(
        filter={'_id': ObjectId(form.get('_id'))},
        update={'$set': item},
    )

    return redirect(f"/item/{form.get('_id')}")


@mongo_admin.route('/update/<attr>/<item_id>')
def update_item(attr, item_id):
    item_id = {"_id": ObjectId(item_id)}
    item = current_app.db.items.find_one(item_id)
    current_app.db.items.update_one(item_id, {"$set": {f'{attr}': not item[f'{attr}']}})
    updated_item = stringify_id(get_item_by_id(item_id))
    return updated_item


@mongo_admin.route('/delete/<item_id>')
def item_delete(item_id):
    item_identifier = {"_id": ObjectId(item_id)}
    current_app.db.items.delete_one(item_identifier)
    for filename in Path(current_app.item_image_folder).glob(f"{item_id}_?.*"):
        filename.unlink()
    return jsonify(success=True)


def stringify_id(updated_item):
    updated_item['_id'] = str(updated_item['_id'])
    return updated_item


def get_item_by_id(item_id):
    return_item = current_app.db.items.find_one(item_id)
    return return_item


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['jpg', 'png', 'jpeg', '.gif']
