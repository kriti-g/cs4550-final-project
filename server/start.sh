#!/bin/bash

export MIX_ENV=prod
export PORT=4740
export DATABASE_URL=ecto://roommate_app:ainuu2vaeD6i@localhost/roommate_app_prod
export SECRET_KEY_BASE=9aZ1EsCPeoHveI1uSkcKBQA2vD6WgadKqDCgRLj1pNiKnL4Fx11/l8YR8GOiWLRW
export JWT_SECRET=nBHMvgnY1c/DV88xFZypFLUF9Pz+OcSNIR944rRr+vrqZkMFlSltONJhWHnrZscS

echo "Starting app..."

_build/prod/rel/roommate_app/bin/roommate_app start
