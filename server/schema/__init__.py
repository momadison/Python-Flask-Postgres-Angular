from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
#add base
Base = declarative_base()
import sys


class Surfer(Base):
    __tablename__ = 'surfers'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255))
    hometown = Column(String(255))
    wipeouts = Column(Integer)
    rank = Column(Integer)

    def serialize(self):
            return {
            'name': self.name, 
            'email': self.email,
            'hometown': self.hometown,
            "rank": self.rank,
            "wipeouts": self.wipeouts
        }

class Board(Base):
    __tablename__ = 'surfboards'
    id = Column(Integer, primary_key=True)
    surfer_id = Column(Integer)
    board_name = Column(String(255))
    color = Column(String(255))
    length = Column(Integer)

class Operator(Base):
    __tablename__ = 'operators'
    operatorId = Column(String(10), primary_key=True)
    name = Column(String(255))
    status = Column(String(255))
    organizationType = Column(String(255))
    filingFee = Column(String(255))
    gathererCode = Column(String(255))
    specialtyCode = Column(String(255))
    lStreet = Column(String(255))
    lCity = Column(String(255))
    lState = Column(String(255))
    lZip = Column(String(255))
    lLat = Column(String(255))
    lLong = Column(String(255))
    mStreet = Column(String(255))
    mCity = Column(String(255))
    mState = Column(String(255))
    mZip = Column(String(255))
    mLat = Column(String(255))
    mLong = Column(String(255))
    phone = Column(String(255))
    ephone = Column(String(255))
    initialP5 = Column(String(255))
    lastP5 = Column(String(255))
    expirationDate = Column(String(255))
    renewalMonth = Column(String(255))
    lease = relationship("Lease", back_populates="operator")
    
    def serialize(self):
            return {
                "operatorId" : self.operatorId,
                "name" : self.name,
                "status" : self.status,
                "organizationType" : self.organizationType,
                "filingFee" : self.filingFee,
                "gathererCode" : self.gathererCode,
                "specialtyCode" : self.specialtyCode,
                "lStreet" : self.lStreet,
                "lCity" : self.lCity,
                "lState" : self.lState,
                "lZip" : self.lZip,
                "lLat" : self.lLat,
                "lLong" : self.lLong,
                "mStreet" : self.mStreet,
                "mCity" : self.mCity,
                "mState" : self.mState,
                "mZip" : self.mZip,
                "mLat" : self.mLat,
                "mLong" : self.mLong,
                "phone" : self.phone,
                "ephone" : self.ephone,
                "initialP5" : self.initialP5,
                "lastP5" : self.lastP5,
                "expirationDate" : self.expirationDate,
                "renewalMonth" : self.renewalMonth
            }

class Lease(Base):
    __tablename__ = 'leases'
    leaseId = Column(String(10), primary_key=True)
    operatorId = Column(String(10), ForeignKey('operators.operatorId'), unique=False)
    name = Column(String(255))
    district = Column(String(255))
    oil = Column(String(255))
    casingGas = Column(String(255))
    gwGas = Column(String(255))
    condensate = Column(String(255))
    operator = relationship("Operator", back_populates="lease")
    
    def serialize(self):
            return {
                "operatorId" : self.operatorId,
                "leaseId" : self.leaseId,
                "name" : self.name,
                "district" : self.district,
                "oil" : self.oil,
                "casingGas" : self.casingGas,
                "gwGas" : self.gwGas,
                "condensate": self.condensate,
            }

class Production(Base):
    __tablename__ = 'productions'
    id = Column(Integer, primary_key=True)
    operatorId = Column(String(10))
    leaseId = Column(String(10), unique=False)
    fieldId = Column(String(50))
    month = Column(String(255))
    year = Column(String(255))
    oilProd = Column(String(255))
    oilDisp = Column(String(255))
    gasProd = Column(String(255))
    gasDisp = Column(String(255))
    
    def serialize(self):
            return {
                "operatorId" : self.operatorId,
                "leaseId" : self.leaseId,
                "fieldId" : self.fieldId,
                "month" : self.month,
                "year" : self.year,
                "oilProd" : self.oilProd,
                "oilDisp" : self.oilDisp,
                "gasProd" : self.gasProd,
                "gasDisp": self.gasDisp,
            }