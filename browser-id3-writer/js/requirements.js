'use strict';

var unsupported = [];

try {
    new ArrayBuffer(2);
} catch (e) {
    unsupported.push('ArrayBuffer');
}

try {
    new Uint8Array([]);
} catch (e) {
    unsupported.push('Uint8Array');
}

try {
    new Blob();
} catch (e) {
    unsupported.push('Blob');
}

try {
    var url = URL.createObjectURL(new Blob());
    URL.revokeObjectURL(url);
} catch (e) {
    unsupported.push('URL');
}

if (unsupported.length > 0) {
    var dangerNode = document.getElementById('alertDanger');
    dangerNode.className = 'alert alert-danger';
    dangerNode.innerText += unsupported.join(', ');
}
