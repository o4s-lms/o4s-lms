#!/bin/bash
sleep 10

echo SETUP.sh time now: `date +"%T" `
mongosh --host mongodb1:27017 -u $MONGODB_INITDB_ROOT_USERNAME --authenticationDatabase admin -p $MONGODB_INITDB_ROOT_PASSWORD <<EOF
 var cfg = {
   "_id": "rs0",
   "version": 1,
   "members": [
     {
       "_id": 0,
       "host": "mongodb1:27017",
       "priority": 2
     },
     {
       "_id": 1,
       "host": "mongodb2:27017",
       "priority": 1
     },
     {
       "_id": 2,
       "host": "mongodb3:27017",
       "priority": 0
     }
   ]
 };
 rs.initiate(cfg, { force: true });
 rs.reconfig(cfg, { force: true });
 rs.secondaryOk();
 db.getMongo().setReadPref('nearest');
 db.getMongo().setSecondaryOk();
EOF