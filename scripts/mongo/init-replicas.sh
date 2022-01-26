#!/bin/bash

mongo --port 27018 <<EOF
var config = {
    "_id": "rs0",
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "mongo1:27018"
        },
        {
            "_id": 1,
            "host": "mongo2:27018"
        },
        {
            "_id": 2,
            "host": "mongo3:27018"
        }
    ]
};
rs.initiate(config, { force: true });
rs.reconfig(config, { force: true });
rs.secondaryOk();
rs.status();
EOF