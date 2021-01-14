#!/bin/bash

cockroach start-single-node \
--insecure \
--listen-addr=localhost:26257 \
--http-addr=localhost:8080 \
--background
