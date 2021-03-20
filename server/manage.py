from flask.cli import FlaskGroup

from project import app
# from schema3 import User


cli = FlaskGroup(app)


# @cli.command("create_db")
# def create_db():
#     db.drop_all()
#     db.create_all()
#     db.session.commit()


# @cli.command("seed_db")
# def seed_db():
#     db.session.add(User(email="mattomadison@gmail.com"))
#     db.session.commit()
#     db.close()

if __name__ == "__main__":
    cli()