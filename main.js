const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bestfriends1.',
    database: 'esp32_data'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to MySQL using mysql2!');
});

app.post('/add', (req, res) => {
    if (!req.body) return res.status(400).send('Missing JSON body');

    const {
        path,
        longitude,
        latitude,
        temperature,
        humidity,
        pressure,
        CO2level,
        TVOClevel,
        magXrot,
        magYrot,
        magZrot,
        imuXrot,
        imuYrot,
        imuZrot,
        imuXaccel,
        imuYaccel,
        imuZaccel,
        micloudness
    } = req.body;

    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
        INSERT INTO drone_data (
            path, timestamp, longitude, latitude, temperature, humidity,
            pressure, CO2level, TVOClevel, magXrot, magYrot, magZrot,
            imuXrot, imuYrot, imuZrot, imuXaccel, imuYaccel, imuZaccel, micloudness
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        path, timestamp, longitude, latitude, temperature, humidity,
        pressure, CO2level, TVOClevel, magXrot, magYrot, magZrot,
        imuXrot, imuYrot, imuZrot, imuXaccel, imuYaccel, imuZaccel, micloudness
    ];

    db.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('❌ Error inserting data:', err);
            return res.status(500).send('Database error');
        }
        console.log('✅ Data inserted:', result);
        res.send('Data added successfully');
    });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

});
