from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float
#add base
Base = declarative_base()

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
            "wipeouts": self.wipeouts,
            "rank": self.rank
        }

class Board(Base):
    __tablename__ = 'surfboards'
    id = Column(Integer, primary_key=True)
    surfer_id = Column(Integer)
    board_name = Column(String(255))
    color = Column(String(255))
    length = Column(Integer)