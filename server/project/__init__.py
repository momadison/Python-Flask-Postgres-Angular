import pandas as pd
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import ast
import os

from schema2 import Surfer, Board, Base

# Initialize Flask
app = Flask(__name__)
CORS(app)
# pull in the config on init
app.config.from_object('project.init-config.Config')
# create new SQLAlchemy instance
db = SQLAlchemy(app)
# import schema tables.  Must come after db is established as it is
# dependent on db
from schema import User


engine=create_engine(os.getenv('DATABASE_URL'))
conn=engine.connect()
session=Session(bind=engine)
#create tables
Base.metadata.create_all(conn)

@app.route('/values', methods=['GET', 'POST'])
def get_or_post():
    if request.method == 'GET':
        #read data with pandas
        # data = pd.read_sql("SELECT * FROM users", conn)
        # return {"data": data.to_json(orient="records")}
        data = session.query(Surfer)
        data_list = []

        for surfer in data:
            temp = {
                "name": surfer.name,
                "email": surfer.email,
                "hometown": surfer.hometown,
                "wipeouts": surfer.wipeouts,
                "rank": surfer.rank
            }
            data_list.append(temp)
        #read data with sqlalchemy
        return {"data": data_list}
        
    if request.method == 'POST':
        # decode from bytes object to dictionary
        data = ast.literal_eval(request.data.decode('utf-8'))
        
        #add to the database with flask-sqlalchemy
        # db.session.add(User(email=data['email']))
        # db.session.commit()
        # return {"msg": "user added successfully"}


        #add to the database with sqlalchemy
        #create specific instances of classes
        surfer = Surfer(name=data['name'], email=data['email'], hometown=data['hometown'], rank=data['rank'])
        board = Board(surfer_id=1, board_name='shredder', color='Blue', length=68)

        #add specific instances
        session.add(surfer)
        session.add(board)
        session.commit()
        return {"msg": "user added successfully"}
