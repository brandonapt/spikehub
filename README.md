# spikehub

ev3hub but for spike prime.

this isn't meant for multiple teams to use, this is a single-project hub.

## how to host

1. install node.js 16
2. clone this repo
3. run `npm install -D`
4. run `npm run backend` to start the backend
5. run the backend, and put the url of the backend in a .env file in the main directory. eg: `VUE_APP_BASE=http://localhost:3000`
6. run `npm run serve` to start the frontend
7. go to the url that the frontend is hosted on

also set the frontend url in backend/config.json

## how to set passcode
backend/config.json

## how to add users
backend/users.json

