import pandas as pd
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import ast
import os


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
# from schema import User

engine=create_engine(os.getenv('DATABASE_URL'))
conn=engine.connect()

@app.route('/values', methods=['GET', 'POST'])
def get_or_post():
    if request.method == 'GET':
        data = pd.read_sql("SELECT * FROM users", conn)
        return {"data": data.to_json(orient="records")}
        
    if request.method == 'POST':
        # decode from bytes object to dictionary
        data = ast.literal_eval(request.data.decode('utf-8'))
        
        #add to the database
        db.session.add(User(email=data['email']))
        db.session.commit()
        return {"msg": "user added successfully"}