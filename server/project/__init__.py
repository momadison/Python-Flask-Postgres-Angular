import pandas as pd
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import json

import numpy as np
import ast
import os
import routes
from schema import Surfer, Board, Base, Operator, Lease, Production
from scrape import scrape_op_info, scrape_for_op_leases, getFieldAndProduction, scrapeRegData

# scrape_op_info()
# Initialize Flask
app = Flask(__name__)
CORS(app)
# pull in the config on init
app.config.from_object('project.init-config.Config')
# create new SQLAlchemy instance
# db = SQLAlchemy(app)
# import schema tables.  Must come after db is established as it is
# dependent on db
# from schema3 import User


engine=create_engine(os.getenv('DATABASE_URL'))
conn=engine.connect()

#create tables
Base.metadata.create_all(conn)

import routes
#Week 10 Routes
app.add_url_rule('/05/', view_func=routes.index)
app.add_url_rule('/05/contact', view_func=routes.contact)
app.add_url_rule('/07/api/v1.0/justice-league', view_func=routes.justice_league)
app.add_url_rule('/07/', view_func=routes.welcome)
app.add_url_rule('/09/api/v1.0/justice-league/real_name/<real_name>', view_func=routes.justice_league_by_real_name)
app.add_url_rule('/09/api/v1.0/justice-league/superhero/<superhero>', view_func=routes.justice_league_by_superhero_name)

#3
@app.route('/operator', methods=['GET','POST'])
def getOperator():
    if request.method == 'POST':
        session=Session(bind=engine)
        data = ast.literal_eval(request.data.decode('utf-8'))
        operatorData = session.query(Operator).all()
        operatorData = [e.serialize() for e in operatorData]
        individualOperator = [x for x in operatorData if x['operatorId'] == data['id']]
        session.close()
        if (len(individualOperator) > 0 ):
            print("found in DB")
            return json.dumps(individualOperator)
        else: 
            print("not in DB, searching the web for data")
            scrape_op_info(data['id'])
            return data
    
    if request.method == 'GET':
        session=Session(bind=engine)
        operatorData = session.query(Operator).all()
        operatorData = [e.serialize() for e in operatorData]
        session.close()
        return json.dumps(operatorData)

@app.route('/leases', methods=['GET', 'POST'])
def get_leases():
    if request.method == 'GET':
        session=Session(bind=engine)
        leaseData = session.query(Lease).all()
        leaseData = [e.serialize() for e in leaseData]
        session.close()
        return json.dumps(leaseData)

    if request.method == 'POST':
        session=Session(bind=engine)
        data = ast.literal_eval(request.data.decode('utf-8'))
        leaseData = session.query(Lease).all()
        leaseData = [e.serialize() for e in leaseData]
        individualLeases = [x for x in leaseData if x['operatorId'] == data['id']]
        session.close()
        if (len(individualLeases) > 0 ):
            print("found in DB")
            return json.dumps(individualLeases)
        else: 
            print("not in DB, searching the web for leases")
            scrape_for_op_leases(data['id'])
            return json.dumps([data])

@app.route('/production', methods=['GET', 'POST'])
def getProduction():
    if request.method == 'GET':
        session = Session(bind=engine)
        productionData = session.query(Production).all()
        productionData = [e.serialize() for e in productionData]
        session.close()
        return json.dumps(productionData)
    if request.method == 'POST':
        session=Session(bind=engine)
        data = ast.literal_eval(request.data.decode('utf-8'))
        productionData = session.query(Production).all()
        productionData = [e.serialize() for e in productionData]
        individualProductions = [x for x in productionData if x['leaseId'] == data['id']]
        session.close()
        if (len(individualProductions) > 0 ):
            print("found in DB")
            return json.dumps(individualProductions)
        else: 
            getFieldAndProduction(data['id'], data['district'], data['operator'])
            return json.dumps([data])
        
@app.route('/regulatory', methods=['GET', 'POST'])
def getRegulatory():
    birthMonth = 3
    scrapeRegData(birthMonth);
    return { "msg": "regulatory record added successfully"}

@app.route('/values', methods=['GET', 'POST'])
def get_or_post():
    session=Session(bind=engine)
    if request.method == 'GET':
        data = session.query(Surfer).all()
        data2 = session.query(Operator).all()
        data_list = []
        
        data_list2 = [e.serialize() for e in data]

        for surfer in data:
            temp = {
                "name": surfer.name,
                "email": surfer.email,
                "hometown": surfer.hometown,
                "rank": surfer.rank,
                "wipeouts": surfer.wipeouts
            }
            data_list.append(temp)
        session.close()
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
        surfer = Surfer(name=data['name'], email=data['email'], hometown=data['hometown'], rank=data['rank'], wipeouts=data['wipeouts'])
        board = Board(surfer_id=1, board_name='shredder', color='Blue', length=68)

        #add specific instances
        session.add(surfer)
        session.add(board)
        session.commit()
        session.close()
        return {"msg": "user added successfully"}
