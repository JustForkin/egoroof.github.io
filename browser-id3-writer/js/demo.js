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
            if (frame === 'USLT') {
                writer.setFrame('USLT', {
                    description: '',
                    lyrics: $(frame).value
                });
            } else {
                writer.setFrame(frame, $(frame).value);
            }
        }
    });
    splittableFrames.forEach(function (frame) {
        if ($(frame).value) {
            writer.setFrame(frame, $(frame).value.split(';'));
        }
    });

    if (picArrayBuffer) {
        writer.setFrame('APIC', {
            type: 3,
            data: picArrayBuffer,
            description: ''
        });
    }

    writer.addTag();
    saveAs(writer.getBlob(), 'song with tags.mp3');
}

$('form').addEventListener('submit', function (e) {
    e.preventDefault();
    loadFile($('song').files[0], function (songArrayBuffer) {
        if ($('APIC').files.length > 0) {
            loadFile($('APIC').files[0], function (picArrayBuffer) {
                save(songArrayBuffer, picArrayBuffer);
            });
        } else {
            save(songArrayBuffer);
        }
    });
});

$('tabsControl').addEventListener('click', function (e) {
    e.preventDefault();

    if (!e.target.hash) {
        return;
    }

    var menuLinks = this.querySelectorAll('li > a');
    for (var i = 0; i < menuLinks.length; i++) {
        var menuElem = menuLinks[i];
        menuElem.classList.remove('active');
    }

    e.target.classList.add('active');

    if (e.target.hash === '#main') {
        $('tabMain').classList.remove('hidden-xs-up');
        $('tabAlbum').classList.add('hidden-xs-up');
        $('tabOther').classList.add('hidden-xs-up');
    } else if (e.target.hash === '#album') {
        $('tabMain').classList.add('hidden-xs-up');
        $('tabAlbum').classList.remove('hidden-xs-up');
        $('tabOther').classList.add('hidden-xs-up');
    } else if (e.target.hash === '#other') {
        $('tabMain').classList.add('hidden-xs-up');
        $('tabAlbum').classList.add('hidden-xs-up');
        $('tabOther').classList.remove('hidden-xs-up');
    }

});
