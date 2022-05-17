import os
import pathlib

import tomli
from flask import Flask, render_template
from flask_pymongo import PyMongo

from mongo_admin import mongo_admin as mongo_admin_blueprint
from auth import auth as auth_blueprint
from main import main as main_blueprint
from mongo import mongo as mongo_blueprint


def create_app():
    app = Flask(__name__)
    config = load_config()

    if config['config']['construction']:
        @app.route("/")
        def in_construction():
            return render_template("comingsoon.html")
        return app

    app.config['SECRET_KEY'] = config['config']['secretkey']
    app.config["MONGO_URI"] = config['config']['mongo']
    app.config["ADMINS"] = config['config']['admins']

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
