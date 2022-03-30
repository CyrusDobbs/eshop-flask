import os

from flask import Blueprint, render_template, send_file, request, session, redirect, url_for, flash
from flask import current_app

main = Blueprint('main', __name__)


@main.route("/")
def hello_world():
    return render_template('base.html')


@main.route('/about/')
def about():
    return render_template('about.html')


@main.route('/shop/')
def shop():
    items_curser = current_app.db.items.find()
    items = [item for item in items_curser]

    for item in items:
        item['_id'] = str(item['_id'])

    return render_template('shop.html', items=items)


@main.route('/contact/')
def contact():
    return render_template('contact.html')


@main.route('/admin/')
def admin():
    return render_template('admin.html')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['jpg', 'png']


@main.route('/additem', methods=['POST'])
def additem():
    if not session['username']:
        return redirect(url_for('auth.login'))

    if 'image' not in request.files:
        flash('No file part')
        return redirect(url_for('main.admin'))

    file = request.files['image']

    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('main.admin'))

    form = request.form
    name = form.get('name')
    desc = form.get('desc')
    jtype = form.get('type')
    price = form.get('price')

    current_app.db.items.insert_one({'name': name,
                                     'desc': desc,
                                     'type': jtype,
                                     'price': price})

    item = current_app.db.items.find_one({'name': name,
                                          'desc': desc,
                                          'type': jtype,
                                          'price': price})

    if file and allowed_file(file.filename):
        file.save(
            os.path.join(current_app.root_path, 'static', 'img', jtype + "s",
                         str(item['_id']) + "." + file.filename.rsplit('.', 1)[1].lower()))

    return render_template('admin.html')


@main.route('/img/ring/<img_id>')
def get_img(img_id):
    filename = os.path.join("static/img/rings", f"{img_id}.jpg")
    return send_file(filename, mimetype='image/jpeg')
