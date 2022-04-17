// Imports the Google Cloud client library for Beta API
/**
 * TODO(developer): Update client library import to use new
 * version of API when desired features become available
 */
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');
const path = require('path');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Creates a client
const client = new speech.SpeechClient();
const dir = path.join('C:', 'Users', 'mweis', 'Downloads', 'foolish_ambitions')

async function transcriptAndRename(filename) {
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const oldPath = path.join(dir, filename);
    console.log("Old path: " + oldPath)
    //const oldPath = "C:\\Users\\mweis\\Downloads\\foolish_ambitions\\4286497098#40(524448000).mp3";
    const model = 'video';
    const encoding = 'MP3';
    const sampleRateHertz = 48000;
    const languageCode = 'en-us';// BCP-47 language code, e.g. en-US

    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        model: model,
    };
    const audio = {
        content: fs.readFileSync(oldPath).toString('base64'),
    };

    const request = {
        config: config,
        audio: audio,
    };


    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n').replace(/[^a-zA-Z ]/g, "");
    console.log('Transcription: ', transcription);
    if (transcription != "") {
        const newPath = path.join("C:\\Users\\mweis\\Downloads\\foolish_ambitions_transcribed\\", transcription + ".mp3");
        console.log('newpath', newPath);
        fs.renameSync(oldPath, newPath)
    }
    else {
        console.log("Could not transcribe: " + oldPath)
        const newPath = path.join("C:\\Users\\mweis\\Downloads\\trash\\", filename);
        console.log('newpath', newPath);
        fs.renameSync(oldPath, newPath)
    }
}
//transcriptAndRename("16094230.mp3")

let count = 0
let sleep = require('util').promisify(setTimeout);
fs.readdir(dir, async (err, files) => {
    if (err) {
        throw err;
    }

    // files object contains all files names
    // log them on console
    for (let file of files) {
        console.log(file)
        transcriptAndRename(file);
        await sleep(69)
    }


});