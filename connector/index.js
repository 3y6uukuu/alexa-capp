const {SERVER, PEAL_API, PEAL_TIMEOUT} = require('../config');

const PARAMS = {
    DEVICE_DETAILS: {
        customerId: '123456',
        resourceIdentifier: 'AAAP52681885',
        resourceType: 'MAC',
        filter: 'WIFI',
        cty: 'DE',
        chl: 'CLOUDUI',
        deviceType: 'MV1Arris',
        cache: 'NO',
    }
};

const request = require('request');

function getDeviceDetails() {
    console.log(`getDeviceDetails => ${SERVER.URL}:${SERVER.PORT}${PEAL_API.DEVICE_DETAILS}`);

    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: `${SERVER.URL}:${SERVER.PORT}${PEAL_API.DEVICE_DETAILS}`,
            qs: PARAMS.DEVICE_DETAILS,
            timeout: PEAL_TIMEOUT,
        }, (error, response, body) =>  {
            if (error || response.statusCode !== 200) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

async function getPassphrase() {
    let passphrase = null;

    try {
        const deviceDetails = await getDeviceDetails();

        const accessPoints = deviceDetails.data.deviceData.wifi.accessPoints;
        passphrase = accessPoints.reduce((prev, curr) => curr.security.keyPassphrase || prev.security.keyPassphrase);
    } catch (error) {
        console.log(error);
    }
    
    console.log(`getPassphrase => ${passphrase}`);

    return passphrase;
}

async function getSSID() {
    let ssidReference = null;

    try {
        const deviceDetails = await getDeviceDetails();

        const accessPoints = deviceDetails.data.deviceData.wifi.accessPoints;
        ssidReference = accessPoints.reduce((prev, curr) => curr.ssidReference || prev.ssidReference);
    } catch (error) {
        console.log(error);
    }

    console.log(`getSSID => ${ssidReference}`);

    return ssidReference;
}


module.exports = {
    getPassphrase,
    getSSID,
};