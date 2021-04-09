#!/bin/bash

export MIX_ENV=prod
# Common port range for this is 4000-10,000
# Valid port range for a user app to listen
# on is something like 1025-32767
export PORT=4740
export SECRET_KEY_BASE=9aZ1EsCPeoHveI1uSkcKBQA2vD6WgadKqDCgRLj1pNiKnL4Fx11/l8YR8GOiWLRW
export DATABASE_URL=ecto://roommate_app:ainuu2vaeD6i@localhost/roommate_app_prod
export JWT_SECRET=nBHMvgnY1c/DV88xFZypFLUF9Pz+OcSNIR944rRr+vrqZkMFlSltONJhWHnrZscS

mix deps.get --only prod
mix compile

mix ecto.reset

mix release
