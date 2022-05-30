import os
import pathlib

import tomli
from flask import Flask, render_template, session, request
from flask_pymongo import PyMongo

from auth import auth as auth_blueprint
from main import main as main_blueprint
from mongo import mongo as mongo_blueprint
from mongo_admin import mongo_admin as mongo_admin_blueprint


def create_app():
    app = Flask(__name__)
    config = load_config()
    app.env = os.environ["FLASK_ENV"]

    if config[app.env]['construction']:
        @app.before_request
        def under_construction():
            if not session.get('username') and "login" not in request.url_rule.rule and "static" not in request.url_rule.rule:
                return render_template("comingsoon.html")

    app.config['SECRET_KEY'] = config[app.env]['secretkey']
    app.config["MONGO_URI"] = config[app.env]['mongo']
    app.config["ADMINS"] = config[app.env]['admins']
    app.item_image_folder = os.path.join(app.static_folder, 'img', config[app.env]['item_imgs'])

    # Allow users to miss out trailing slashes
    app.url_map.strict_slashes = False

    mongo = PyMongo(app)
    app.db = mongo.db

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(mongo_admin_blueprint)
    app.register_blueprint(mongo_blueprint)

    return app


def load_config():
    with open(os.path.join(pathlib.Path(__file__).parent.resolve(), "conf.toml"), "rb") as f:
        config = tomli.load(f)
    return config


if __name__ == "__main__":
    create_app().run(debug=True)
