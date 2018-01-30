const express = require('express');
const alexa = require('alexa-app');
const AmazonSpeech = require('ssml-builder/amazon_speech');

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

alexaApp.launch((request, response) => {
    const speech = new AmazonSpeech();

    speech
        .say('You launched the')
        .sayAs({
            word: 'Connectivity Application!',
            interpret: 'interjection',
        });

    const speechOutput = speech.ssml();

    response.say(speechOutput);
});

alexaApp.intent('getDeviceDetails', {
        slots: {
            settingProperty: 'propertyString',
        },
        utterances: [
            `to tell me Wi-Fi {-|settingProperty}`,
            `to tell me my Wi-Fi {-|settingProperty}`,
            `for a Wi-Fi {-|settingProperty}`,
            `what's my Wi-Fi {-|settingProperty}`,
            `what is my Wi-Fi {-|settingProperty}`,
            `what's my network {-|settingProperty}`,
            `what is my network {-|settingProperty}`,
            `tell me network {-|settingProperty}`,
            `tell me my {-|settingProperty}`,
            `for a {-|settingProperty}`,
            `what's my {-|settingProperty}`,
            `what is my {-|settingProperty}`,
        ]
    },
    async (request, response) => {
        const speech = new AmazonSpeech();

        const cases = {
            password: 'getPassphrase',
            passport: 'getPassphrase',

            name: 'getSSID',
            title: 'getSSID',
        };

        const requestedSettingProperty = request.slot('settingProperty');

        const settingProperty = await connector[cases[requestedSettingProperty]]();

        if (settingProperty === null) {
            speech.prosody({volume: 'soft'}, 'Oops, something went wrong, please try again later.');
        } else {
            speech
                .say(`Your ${requestedSettingProperty} is:`)
                .pause('500ms')
                .sayAs({
                    word: settingProperty,
                    interpret: 'characters',
                });
        }

        const speechOutput = speech.ssml();

        response.say(speechOutput);
    }
);

alexaApp.intent('secret', {
        utterances: [
            'to tell me a secret',
        ]
    },
    (request, response) => {
        const speech = new AmazonSpeech();

        speech.say('Okay, I have one.')
            .pause('1s')
            .whisper('Alexa – is not a real Human!')
            .say('Can you believe it?');

        const speechOutput = speech.ssml();

        response.say(speechOutput);
    }
);

expressApp.listen(PORT, () => console.log(`Listening on port ${PORT}, try http://localhost:${PORT}/test`));