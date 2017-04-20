const url = 'https://raw.githubusercontent.com/egoroof/egoroof.github.io/master/unicorns/audio/daft_punk_get_lucky.mp3';
const songSize = 4509696;

const id3Writer = new ID3Writer(new ArrayBuffer(0));
id3Writer.setFrame('TIT2', 'Home')
    .setFrame('TPE1', ['Eminem', '50 Cent'])
    .setFrame('TALB', 'Friday Night Lights')
    .setFrame('TYER', 2004)
    .setFrame('TRCK', '6/8')
    .setFrame('TCON', ['Soundtrack']);
id3Writer.addTag();
const id3Tag = new Uint8Array(id3Writer.arrayBuffer);

const button = document.getElementById('start');

button.addEventListener('click', function () {
    button.disabled = 'disabled';
    button.innerText = 'Fetching...';
    fetch(url).then(response => {
        const fileStream = streamSaver.createWriteStream('daft_punk_get_lucky.mp3', songSize + id3Tag.byteLength);
        const writer = fileStream.getWriter();
        const reader = response.body.getReader();
        let readByteCount = 0;

        // push id3 tag first
        writer.write(id3Tag).then(pump).then(() => {
            console.log('All done');
            button.innerText = 'Start download';
            button.disabled = '';
        });

        function pump() {
            return reader.read().then(result => {
                if (result.done) {
                    return writer.close();
                } else {
                    readByteCount += result.value.length;
                    button.innerText = `Downloaded ${Math.ceil(readByteCount / songSize * 100)} %`;
                    return writer.write(result.value).then(pump);
                }
            });
        }
    });
});
