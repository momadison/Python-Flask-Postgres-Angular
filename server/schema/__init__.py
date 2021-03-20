from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date
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