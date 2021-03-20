from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from schema import Operator
#from project import db

import os

engine=create_engine('postgresql://hello_flask:hello_flask@db:5432/hello_flask_dev')
conn=engine.connect()
#create tables
from schema import Operator, Base
Base.metadata.create_all(conn)

class dbController:
    def __init__(self, name):
        self.name= name

    @staticmethod
    def addOperator(operator):
        session=Session(bind=engine)
        operator = operator.to_dict()
        newOperator = Operator(
            operatorId= operator['Operator Number:'][0], 
            name = operator['Operator Name:'][0],
            status = operator['Organization Status:'][0],
            organizationType = operator['Organization Type:'][0],
            filingFee = operator['Filing Fee Amount Paid:'][0],
            gathererCode = operator['Gatherer Code:'][0],
            specialtyCode = operator['Activity/Speciality Code(s):'][0],
            lStreet = operator['lStreet'][0],
            lCity = operator['lCity'][0],
            lState= operator['lState'][0],
            lZip= operator['lZip'][0],
            lLat= operator['lLat'][0],
            lLong= operator['lLong'][0],
            mStreet= operator['lStreet'][0],
            mCity= operator['lCity'][0],
            mState= operator['lState'][0],
            mZip= operator['lZip'][0],
            mLat= operator['lLat'][0],
            mLong= operator['lLong'][0],
            phone = operator['Organization Phone No.:'][0],
            ephone = operator['Emergency Phone No.:'][0],
            initialP5 = operator['Initial P-5 Filed Date:'][0],
            lastP5 = operator['Last P-5 Filed Date:'][0],
            expirationDate = operator['Expiration Date:'][0],
            renewalMonth = operator['Renewal Month:'][0],
        )
        print(f"Here is the new operator: ", newOperator)
        # #db.session.add(Operator(newOperator)
        # #db.session.commit()
        #operator_data = Operator(newOperator)
        #print(f"new operator is: {operator_data}")
        
        session.add(newOperator)
        session.commit()
        session.close()
        getLeases(newOperator['operatorId'])
        return {"msg": "user added successfully"}
    
    @staticmethod
    def addLease(operatorId):
        session=Session(bind=engine)

        session.close()
        return "hello"
        
