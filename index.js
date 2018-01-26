const express = require('express');
const alexa = require('alexa-app');

const PORT = process.env.port || 8082;
const expressApp = express();

const alexaApp = new alexa.app('test');
const connector = require('./connector');

alexaApp.express({
    expressApp,
    checkCert: false,
    debug: true
});

expressApp.set('view engine', 'ejs');

alexaApp.launch((request, response) => response.say('You launched the <say-as interpret-as="interjection">Connectivity Application!</say-as>'));

alexaApp.intent('getpassword', {
        utterances: [
            'for a password',
            'what is my password',
            'for a passport',
            'what is my passport',
        ]
    },
    async (req, res) => {
        const password = await connector.getPassphrase();

        if (password === null) {
            res.say('Something went wrong, please try again later.');
        } else {
            res.say(`Your password is: <prosody rate="x-slow"><say-as interpret-as="characters">${password}</say-as></prosody>`);
        }
    }
);

alexaApp.intent('getwifiname', {
        utterances: [
            'for a wi-fi name',
            'what is my wi-fi name',
            'what is wi-fi name',
            'for a name',
            'what is name',
            'for a while find name',
            'for a ride find mean',
            'for a while find',
        ]
    },
    async (req, res) => {
        const ssidReference = await connector.getSSID();

        if (ssidReference === null) {
            res.say('Something went wrong, please try again later.');
        } else {
            res.say(`Your Wi-Fi name is: <prosody rate="x-slow">${ssidReference}</prosody>`);
        }
    }
);



expressApp.listen(PORT, () => console.log('Listening on port ' + PORT + ', try http://localhost:' + PORT + '/test'));