import os
import pathlib

import tomli
from flask import Flask
from flask_pymongo import PyMongo


def create_app():
    app = Flask(__name__)

    with open(os.path.join(pathlib.Path(__file__).parent.resolve(), "conf.toml"), "rb") as f:
        toml_dict = tomli.load(f)

    app.config['SECRET_KEY'] = toml_dict['config']['secretkey']
    app.config["MONGO_URI"] = toml_dict['config']['mongo']
    app.config["ADMINS"] = toml_dict['config']['admins']

    mongo = PyMongo(app)
    app.db = mongo.db

    from auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from admin import administration as admin_blueprint
    app.register_blueprint(admin_blueprint)

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
