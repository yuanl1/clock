BEGIN;

CREATE TABLE Presets (
       id INTEGER NOT NULL PRIMARY KEY,
       name TEXT UNIQUE NOT NULL,
       date TEXT NOT NULL  
       size INTEGER NOT NULL,       
);

CREATE TABLE States (
       id INTEGER NOT NULL PRIMARY KEY,       
       preset_name TEXT NOT NULL REFERENCES Presets(name) ON UPDATE CASCADE ON DELETE CASCADE,
       duration INTEGER NOT NULL,
       transition INTEGER NOT NULL,    
       groupA TEXT NOT NULL,       
       groupB TEXT NOT NULL,       
       groupC TEXT NOT NULL,       
       groupD TEXT NOT NULL,       
       groupE TEXT NOT NULL,       
       groupF TEXT NOT NULL,       
       groupG TEXT NOT NULL,       
       groupH TEXT NOT NULL,       
       groupI TEXT NOT NULL,       
       groupJ TEXT NOT NULL,       
       groupK TEXT NOT NULL,       
       groupL TEXT NOT NULL,       
       sector0 TEXT NOT NULL,       
       sector1 TEXT NOT NULL,       
       sector2 TEXT NOT NULL,       
       sector3 TEXT NOT NULL,       
       sector4 TEXT NOT NULL,       
       sector5 TEXT NOT NULL,       
       sector6 TEXT NOT NULL,       
       sector7 TEXT NOT NULL,       
       sector8 TEXT NOT NULL,       
       sector9 TEXT NOT NULL,       
       sector10 TEXT NOT NULL,       
       sector11 TEXT NOT NULL
);

COMMIT;

