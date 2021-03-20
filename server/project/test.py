# import pandas as pd
# from flask import Flask, jsonify, request, Response
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import create_engine
# from sqlalchemy.orm import Session
# import json

# import numpy as np
# import ast
# import os
# import routes
# from schema2 import Surfer, Board, Base

# # Initialize Flask
# app = Flask(__name__)
# CORS(app)
# # pull in the config on init
# app.config.from_object('project.init-config.Config')
# # create new SQLAlchemy instance
# db = SQLAlchemy(app)
# # import schema tables.  Must come after db is established as it is
# # dependent on db
# from schema3 import User


# engine=create_engine(os.getenv('DATABASE_URL'))
# conn=engine.connect()

# #create tables
# Base.metadata.create_all(conn)

# import routes

# #Week 10 Routes
# app.add_url_rule('/05/', view_func=routes.index)
# app.add_url_rule('/05/contact', view_func=routes.contact)
# app.add_url_rule('/07/api/v1.0/justice-league', view_func=routes.justice_league)
# app.add_url_rule('/07/', view_func=routes.welcome)
# app.add_url_rule('/09/api/v1.0/justice-league/real_name/<real_name>', view_func=routes.justice_league_by_real_name)
# app.add_url_rule('/09/api/v1.0/justice-league/superhero/<superhero>', view_func=routes.justice_league_by_superhero_name)

# # Route with DB
# @app.route('/values', methods=['GET', 'POST'])
# def get_or_post():
#     session=Session(bind=engine)
#     if request.method == 'GET':
#         #read data with pandas
#         # data = pd.read_sql("SELECT * FROM users", conn)
#         # return {"data": data.to_json(orient="records")}
#         data = session.query(Surfer).all()
#         data_list = []

#         #from type class list to json
#         # data_list2 = list(np.ravel(data))
        
#         data_list2 = [e.serialize() for e in data]

#         for surfer in data:
#             temp = {
#                 "name": surfer.name,
#                 "email": surfer.email,
#                 "hometown": surfer.hometown,
#                 "rank": surfer.rank,
#                 "wipeouts": surfer.wipeouts
#             }
#             data_list.append(temp)
#         #read data with sqlalchemy
#         session.close()
#         return {"data": data_list2}
        
#     if request.method == 'POST':
#         # decode from bytes object to dictionary
#         data = ast.literal_eval(request.data.decode('utf-8'))
        
#         #add to the database with flask-sqlalchemy
#         db.session.add(User(email=data['email']))
#         db.session.commit()
#         return {"msg": "user added successfully"}
#         db.session.close()

#         #add to the database with sqlalchemy
#         #create specific instances of classes
#         # surfer = Surfer(name=data['name'], email=data['email'], hometown=data['hometown'], rank=data['rank'], wipeouts=data['wipeouts'])
#         # board = Board(surfer_id=1, board_name='shredder', color='Blue', length=68)

#         #add specific instances
#         # session.add(surfer)
#         # session.add(board)
#         # session.commit()
#         # session.close()
#         # return {"msg": "user added successfully"}
