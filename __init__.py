from flask import Flask, render_template, jsonify, send_file
from flask_pymongo import PyMongo
import tomli


def create_app():
    app = Flask(__name__)

    with open("conf.toml", "rb") as f:
        toml_dict = tomli.load(f)

    app.config['SECRET_KEY'] = toml_dict['config']['secretkey']
    app.config["MONGO_URI"] = toml_dict['config']['mongo']

    mongo = PyMongo(app)
    app.db = mongo.db

    from auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
