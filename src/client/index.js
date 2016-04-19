// par Abdoul Rahim Diallo, Mohamed Nassim Hamour, Yacouba Garba Ouddou
// Aimé Sean Shaq' BOUSSOUGOU BOUSSOUGOU, Stéphanie England
var $          = require('jquery');
var NodeRSA    = require('node-rsa');
var CryptoJS   = require('crypto-js');
var superagent = require('superagent');

var $focus = $('#focus');
var $body  = $('#body');

var key = null;
var etat = null;
var decryptedLetters = [];

var decryptMessage = function( msg ) {
    var resultat = "Failed to decrypt";
    try {
        resultat = key.decrypt(msg, 'utf8');
    } catch (e) {
        console.warn("Problem: " + e);
    }
    return resultat;
}

var populateDecryptedLetters = function() {
    myPublicKey = key.exportKey('public');
    decryptedLetters = [];
    etat.letters.forEach( function( letter ) {
        if (letter.to == myPublicKey) {
            decryptedLetters.push( {
                date: letter.date,
                msg: decryptMessage(letter.msg),
            });
        }
    });
};
var reload = function( cb ) {
    if (! cb )
        cb = function(){};
    superagent
        .get("/etat")
        .send()
        .end( function(err, res) {
            if (err) return cb(err);
            etat = res.body;
            cb(null);
        });
}

var addAddress = function(name, pem) {
    // var pem = prompt("Public key");
    if (! pem) {
        var randomKey = new NodeRSA({b: 512});
        pem = randomKey.exportKey('public');
    }
    else if (pem == "") {
        var randomKey2 = new NodeRSA({b: 512});
        pem = randomKey2.exportKey('public');
    }
    etat.yp[pem] = {name: name, pem: pem};
    superagent
        .post("/addAddress")
        .send({pem:pem, name:name})
        .end(console.log.bind(console));
};

var newMessage = function(text, address) {
    var pubKey = new NodeRSA(address);
    var msg = {date:new Date(), to: address, msg: pubKey.encrypt(text,'base64')};
    console.log(JSON.stringify(msg, null, 2));
    superagent
        .post("/postMessage")
        .send(msg)
        .end(console.log.bind(console));
}

var redraw_view = function() {
    var $content;
    var $br = ('<br/>');
    switch($focus.val()) {
    case "inbox" :
        var $list = $('<ul>');
        decryptedLetters.forEach( function(letter) {
            $list.append($('<li>').append(
                $('<a href="#">').append("Date: "+letter.date).click(function(){
                    alert("Envoyé le: "+letter.date+"\n\n\n" +letter.msg);
                }))
            );
        });
        var $reload = $('<button>').append("Rafraîchir")
            .click(function(){ reload( function() {
              populateDecryptedLetters();
              redraw_view();
            }) });
        $content =  [$br, $list,$br, $reload];
        break;
    case "outbox":
        var $br = ('<br/>');
        var $list = $('<ul>');
        for(var i = 0 ; i<etat.letters.length ; i++) {
            $list.append($('<li>').append(
                $('<a href="#">').append("Date: "+etat.letters[i].date).click(function(letter){
                    alert("Envoyé le: "+letter.date +"\n\n\n" +letter.msg);
                }))
            );
        };
        var $reload = $('<button>').append("Rafraîchir")
            .click(function(){ reload( function() {
              populateDecryptedLetters();
              redraw_view();
            }) });
        $content =  [$br,$list,$br, $reload];
        break;
    case "write" :
        var $br = ('<br/>')
        var $textarea = $('<textarea id="textenvoi">');
        var $addresses = Object.keys(etat.yp).map( function( addr ) {
          return $('<option value="'+addr+'">').append(etat.yp[addr].name);
        });
        var $to = $('<select>').append( $addresses );
        var $newMessage = $('<button>').append("Envoyer le message")
            .click(function(){
                newMessage($textarea.val(), $to.val());
                $textarea.val("");
                reload( populateDecryptedLetters );
                alert("Message envoyé");
            } );
        $content = [ $br, $br, "Composez votre message :", $br, $br, $to, $br, $br, $textarea, $br, $br, $newMessage ];
        break;
    case "yp" :
        var $br = ('<br/>')
        var $list = $('<ul id="liste">');
        Object.keys(etat.yp).forEach( function(pem) {
            var entry = etat.yp[pem];
            $list.append($('<li>').append(
                $('<a href="#">').append(entry.name).click(function(){
                    alert(JSON.stringify(entry));
                }))
            );
        });
        var $newAddress = $('<button>').append("Nouveau contact")
            .click(function(){var nom = prompt("Entrez le nom du nouveau contact");
            var pem = prompt("Entrez la clé du nouveau contact");
            var pemfinal = ( +CryptoJS.AES.encrypt(key.exportKey(), pem)
            .toString() );
            addAddress(nom, pemfinal); redraw_view();})
        $content =  [$br,$br, "Liste de contacts", $list, $newAddress ];
        break;
    };
    $body.empty().append($content);
};

$focus.change( redraw_view );


reload( function(err) {
    if (err) return console.error(err);
    if (! etat.encryptedKey) {
        // we do not have our key yet
        key = new NodeRSA({b: 512});
        var name = prompt("Entrez votre nom");
        password = prompt("Mot de passe");
        etat.encryptedKey = CryptoJS.AES.encrypt(key.exportKey(), password)
            .toString();
        superagent
            .post("/storeEncryptedKey")
            .send({encryptedKey: etat.encryptedKey})
            .end(console.log.bind(console));
        // add my public key to the yp
        addAddress((name || "me"), key.exportKey('public'));
    } else while (true) {
        var pem = null;
        try {
            password = prompt("Entrez votre mot de passe");
            pem = CryptoJS.AES.decrypt(etat.encryptedKey, password)
                .toString(CryptoJS.enc.Utf8);
            key = new NodeRSA(pem);
            break;
        } catch (e) {
            alert("Mauvais mot de passe! Essayez de nouveau");
        }
    }

    // build decrypted list of messages
    populateDecryptedLetters();
    redraw_view();
});
