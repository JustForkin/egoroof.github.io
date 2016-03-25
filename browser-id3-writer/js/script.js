'use strict';

var $ = document.getElementById.bind(document);

function loadFile(file, onSuccess) {
    var reader = new FileReader();
    reader.onload = function () {
        onSuccess(reader.result);
    };
    reader.onerror = function () {
        console.error('Reader error', reader.error);
    };
    reader.readAsArrayBuffer(file);
}

function save(songArrayBuffer, picArrayBuffer) {
    var writer = new ID3Writer(songArrayBuffer);
    var simpleFrames = ['TIT2', 'TALB', 'TPE2', 'TRCK', 'TPOS', 'TYER', 'USLT', 'TPUB'];
    var splittableFrames = ['TPE1', 'TCOM', 'TCON'];

    simpleFrames.forEach(function (frame) {
        if ($(frame).value) {
            writer.setFrame(frame, $(frame).value);
        }
    });
    splittableFrames.forEach(function (frame) {
        if ($(frame).value) {
            writer.setFrame(frame, $(frame).value.split(';'));
        }
    });

    if (picArrayBuffer) {
        writer.setFrame('APIC', picArrayBuffer);
    }

    writer.addTag();
    saveAs(writer.getBlob(), 'song with tags.mp3');
}

$('form').addEventListener('submit', function (e) {
    e.preventDefault();
    loadFile($('song').files[0], function (songArrayBuffer) {
        if ($('APIC').files.length) {
            loadFile($('APIC').files[0], function (picArrayBuffer) {
                save(songArrayBuffer, picArrayBuffer);
            });
        } else {
            save(songArrayBuffer);
        }
    });
});
