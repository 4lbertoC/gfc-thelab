(function () {
    var t = document.getElementById('loadText');
    var i = 0;
    var txtOptions = ['Almost done...', 'One more second...', 'Another script loaded...', 'Images fetched...', 'Something else is ready...',
                            'Keep reading...', 'Only few files left to finish...', 'NULL POINTER EXCEPTION', 'Just joking...', 'Your connection is slow, you know?',
                            'Let\'s start again...', 'Loading...'];
    var txtOptionsLength = txtOptions.length;
    var getText = function () {
        if(document.all) {
            return t.innerText;
        } else {
            return t.textContent;
        }
    }
    var setText = function (txt) {
        if(document.all) {
            t.innerText = txt;
        } else {
            t.textContent = txt;
        }
    }
    var changeTextAgain = function() {
        setTimeout(function () {
            if(t && t.parentElement && getText() != 'Done!') {
                var idx = i++ % txtOptionsLength;
                setText(txtOptions[idx]);
                changeTextAgain();
            }
        }, 500);
    };
    changeTextAgain();
})();