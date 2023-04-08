const axios = require('axios');
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

//variable for pi status
let lastHeartbeat = new Date().getTime()

app.use(express.static('public'));

app.get('/environment', (req, res) => {
    const environment = process.env.NODE_ENV || 'development';
    raspberryPiServerUrl: process.env.RASPBERRY_PI_SERVER_URL || '',
        res.status(200).json({environment});
});

app.get('/heartbeat', (req, res) => {
    lastHeartbeat = new Date().getTime();
    res.status(200).send({message: 'Heartbeat received'});
});

app.get('/pi-status', (req, res) => {
    const currentTime = new Date().getTime();
    const piOnline = currentTime - lastHeartbeat <= 10000; // 10 seconds
    res.status(200).json({online: piOnline});
});



