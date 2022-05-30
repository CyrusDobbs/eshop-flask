from flask import Blueprint, render_template, request, current_app, flash, redirect, url_for, session
from werkzeug.security import check_password_hash

auth = Blueprint('auth', __name__)


@auth.route('/login')
def login():
    if not session.get('username'):
        return render_template('login.html')
    else:
        return redirect(url_for('administration.admin'))


@auth.route('/login', methods=['POST'])
def login_post():
    # login code goes here
    username = request.form.get('username')
    password = request.form.get('password')

    user = current_app.db.users.find_one({'username': username})

    if not user or not check_password_hash(user['password'], password):
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))  # if the user doesn't exist or password is wrong, reload the page

    session["username"] = username
    return redirect("/shop")


@auth.route('/logout')
def logout():
    if "username" in session:
        session.pop("username", None)
        return render_template("signout.html")
    else:
        return render_template('login.html')
