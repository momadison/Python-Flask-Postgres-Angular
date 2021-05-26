import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from schema import Operator, Lease, Production
#from project import db

import os
import pandas as pd

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
        
        session.add(newOperator)
        session.commit()
        session.close()
        return {"msg": "operator added successfully"}
    
    @staticmethod
    def addLease(lease):
        session=Session(bind=engine)
        print("lease is : ", lease)
        newLease = Lease(
            leaseId = lease['leaseId'],
            operatorId= lease['operatorId'], 
            name = lease['name'],
            district = lease['district'],
            oil = lease['oil'],
            casingGas = lease['casingGas'],
            gwGas = lease['gwGas'],
            condensate = lease['condensate'],
        )
        
        session.add(newLease)
        session.commit()
        # session.close()
        session.close()
        return {"msg": "lease added successfully"}
        
    @staticmethod
    def addProduction(production):
        session=Session(bind=engine)
        # myString = str(production['year']) + str(production['month'])
        # myDate = datetime.strptime(myString, format='%Y%B')
        # print("my date: ", myDate)
        if (production['oilProd'] == 'NO RPT' or production['oilDisp'] == 'NO RPT' or \
        production['gasProd'] == 'NO RPT' or production['gasDisp'] == 'NO RPT'):
            return {"msg": "unreported data"}
        newProduction = Production(
            operatorId = production['operatorId'],
            leaseId= production['leaseId'], 
            fieldId = production['fieldId'],
            month = production['month'],
            year = production['year'],
            oilProd = production['oilProd'],
            oilDisp = production['oilDisp'],
            gasProd = production['gasProd'],
            gasDisp = production['gasDisp'],
        )
        
        
        
        alreadyExists = session.query(Production).filter(
                Production.operatorId == newProduction.operatorId  and \
                Production.leaseId == newProduction.leaseId and \
                Production.month == newProduction.month and \
                Production.year == newProduction.year
            ) or ""
        if (alreadyExists != ""):
            session.add(newProduction)
            session.commit()
            session.close()
            print("success")
            return {"msg": "production added successfully"}
        else:
            print("already exists")
            return {"msg": "record already exists"}
