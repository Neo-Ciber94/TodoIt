#!/bin/bash

mongo <<EOF
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
            "host": "mongo2:27019"
        },
        {
            "_id": 2,
            "host": "mongo3:27020"
        }
    ]
};
rs.initiate(config, { force: true });
rs.reconfig(config, { force: true });
rs.secondaryOk();
rs.status();
EOF