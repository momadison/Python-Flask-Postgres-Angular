# from project import db

# # define a database Model
# class User(db.Model):
#     __tablename__ = "users"
    
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(128), unique=False, nullable=False)
#     active = db.Column(db.Boolean(), default=True, nullable=False)

#     def __init__(self, email):
#         self.email = email