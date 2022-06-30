const pinataSDK = require('@pinata/sdk');
require('dotenv').config()
const fs = require('fs');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

/*
pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});
*/

const readableStreamForFile = fs.createReadStream('./images/1.jpg');

const options = {
    pinataMetadata: {
        name: "MY NFT COLLECTION",
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};

const pinJSONToIPFS = (body) => {
    return pinata.pinJSONToIPFS(body, options).then((result) => {
        //handle results here
        //console.log(result);
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}


const pinFileToIPFS = () => {
    return pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        //handle results here
        console.log(result);
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}

const getMetaData = async () => {
    const imageurl = await pinFileToIPFS()
    console.log(imageurl)
    const body = {
        name: "My NFT Collection 1",
        description: "This is my awesome nft collection 1",
        image: imageurl
    };

    const metaData = await pinJSONToIPFS(body)
    console.log(metaData)
}

getMetaData()

/*
https://gateway.pinata.cloud/ipfs/QmP9Q2aPTtW6MiUEactDosQhS1sJGrAg5TkrdDxoVw2tni

NFT1: https://gateway.pinata.cloud/ipfs/QmeMgWPqyjrVjYVEee7t9sQ5RVUM7G6c63NNerGuBqxwWt
NFT2: https://gateway.pinata.cloud/ipfs/QmSVHvfw3GsuHmePMGgTWbJGEsSr93fCoqz3awkVZgBT3D
*/