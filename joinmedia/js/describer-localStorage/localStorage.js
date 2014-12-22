if(window.UseLocalStorage && window.loadUnminifyVersion){
    console.warn('-------------!!!!!-----localStorage wird nicht gelöscht!------!!!!!-----');
}

// Modernizr-Test auf localStorage
// localStorage test
window.testLocalStorage = function(){
    var mod = 'modernizr';
    try{
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    }catch(e){
        return false;
    }
};

// Die Funktion prüft, ob es im localStorage schon einen identischen key (jeweils ohne versionierungsnummer) gibt und löscht diese incl. value im localStorage.
// check for a identical key (each without version number) in localStorage and delete it possibly.
window.clearLocalStorageForKey = function(p_key){
    var keyWithoutExtension = p_key.substr(0, p_key.lastIndexOf('.'));
    var nonversionkey = keyWithoutExtension.substr(0, keyWithoutExtension.lastIndexOf('.'));
    var patt = new RegExp(nonversionkey);
    var index = 0;
    var length = localStorage.length;
    try{
        for(; index <= length; index++){
            if(patt.test(localStorage.key(index)) && (localStorage.key(index) !== p_key)){
                localStorage.removeItem(localStorage.key(index));
            }
        }
    }catch(e){

    }
};

// Fügt das CSS zum DOM entweder als link-Element oder aus dem localStorage
window.addCSSToDOM = function(p_src){
    var linkElem;
    var styleElem;
    // wenn localStorage vorliegt aber der Datei-Pfade(key) und entsprechen die value nicht vorhanden ist.
    // -> dynamische Erstellung eines link-tags mit Angabe des Datei-Pfades und anschließender ajax nach Dom-Ready um den Conten im localStorage abzulengen (kommt aus dem Cache).
    if (window.UseLocalStorage && testLocalStorage() && (localStorage[p_src] === undefined)) {
        // window.localStorage is available!
        linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', p_src);
        document.getElementsByTagName('head')[0].appendChild(linkElem);
        onDomOrAjaxReady(function(){
            (function(){
                var xhr;
                xhr = new XMLHttpRequest();
                xhr.open('GET', p_src, true);
                xhr.send();
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4 && xhr.status !== 404 && xhr.responseText !== ''){
                        clearLocalStorageForKey(p_src);
                        localStorage[p_src] = xhr.responseText;
                    }
                };
            })()
        });
        // wenn localStorage vorliegt und der Datei-Pfade(key) und entsprecher value im localStorage vorhanden ist.
        // -> dynamische Erstellung eines style-tags mit injection der value aus dem localStorage.
    }else if(window.UseLocalStorage && testLocalStorage() && (localStorage[p_src] !== undefined)){
        styleElem = document.createElement('style');
        styleElem.appendChild(document.createTextNode(localStorage[p_src]));
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        // wenn kein localStorage vorliegt
        // -> dynamische Erstellung eines link-tags mit Angabe des Datei-Pfades
    }else{
        linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', p_src);
        document.getElementsByTagName('head')[0].appendChild(linkElem);
    }
};

// Fügt das JS zum DOM entweder als link-Element oder aus dem localStorage
window.addJSToDOM = function(p_src, p_attrkey, p_attrval){
    var scriptElem;
    // wenn localStorage vorliegt aber der Datei-Pfade(key) und entsprechen die value nicht vorhanden ist.
    // -> dynamische Erstellung eines script-tags mit Angabe des Datei-Pfades und anschließender ajax nach Dom-Ready um den Conten im localStorage abzulengen (kommt aus dem Cache).
    if(window.UseLocalStorage && testLocalStorage() && (typeof localStorage[p_src] === 'undefined')){
        // window.localStorage is available!
        scriptElem = document.createElement('script');
        scriptElem.setAttribute('src', p_src);
        if(typeof p_attrkey !== 'undefined'){
            scriptElem.setAttribute(p_attrkey, p_attrval);
        }
        scriptElem.async = false;
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
        onDomOrAjaxReady(function(){
            (function(){
                var xhr;
                xhr = new XMLHttpRequest();
                xhr.open('GET', p_src, true);
                xhr.send();
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4 && xhr.status !== 404 && xhr.responseText !== ''){
                        clearLocalStorageForKey(p_src);
                        localStorage[p_src] = xhr.responseText;
                    }
                };
            })()
        });
        // wenn localStorage vorliegt und der Datei-Pfade(key) und entsprecher value im localStorage vorhanden ist.
        // -> dynamische Erstellung eines style-tags mit injection der value aus dem localStorage.
    }else if(window.UseLocalStorage && testLocalStorage() && (typeof localStorage[p_src] !== 'undefined')){
        scriptElem = document.createElement('script');
        if(typeof p_attrkey !== 'undefined'){
            scriptElem.setAttribute(p_attrkey, p_attrval);
        }
        scriptElem.text = localStorage[p_src];
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
        // wenn kein localStorage vorliegt
        // -> dynamische Erstellung eines link-tags mit Angabe des Datei-Pfades
    }else{
        scriptElem = document.createElement('script');
        scriptElem.setAttribute('src', p_src);
        if(typeof p_attrkey !== 'undefined'){
            scriptElem.setAttribute(p_attrkey, p_attrval);
        }
        scriptElem.async = false;
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
    }
};

window.checkLocalStorageByTimestamp = function(){
    if(window.UseLocalStorage && testLocalStorage()){
        try{
            // wenn kein timestamp im localStorage vorhanden ist wird einer erstellt.
            if(localStorage.getItem('timestamp') === null){
                localStorage['timestamp'] = new Date().getTime().toString();
            }else{
                // wenn der timestamp im localStorage kleiner ist als der fest codierte Timestamp, wird wird der localStorage gelöscht.
                if (parseInt(localStorage['timestamp'], 10) < 1402389706108) { // Nicht Ändern!!!! So wird bei allen Clients der localStorage gelöscht!!!! Nur Ändern, wenn sich die Datei-Pfad in der main.js zu den Modulen ändern Bsp. require.config({  paths:{ 'jmButtonForAddClassOnRelatedElem': 'mylibs/AMD-Plugins/jmButtonForAddClassOnRelatedElem',......
                    window.localStorage.clear();
                }
            }
        }catch(e){
        }
    }
};

checkLocalStorageByTimestamp();