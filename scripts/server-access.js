define(function () {
  
  function maps(){
    return request('get', '/maps');
  }

  function load(name) {
    return request('get', '/map/'+name);
  }

  function save(name, map) {
    return request('put', '/map/'+name, map);
  }

  function request(verb, url, body) {
    var xmlhttp = new XMLHttpRequest();
    var deferred = Promise.pending();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
        if(xmlhttp.status == 200){
          

          //console.debug("xmlhttp.getResponseHeader('Content-Type')", xmlhttp.getResponseHeader('Content-Type'));
          var result = xmlhttp.responseText;
          if(xmlhttp.getResponseHeader('Content-Type').startsWith('application/json')){
            result = JSON.parse(result);
          }

          //console.debug('http success', result, xmlhttp);

          deferred.fulfill(result);
        } else {
          //console.debug('http failed');
          deferred.reject(xmlhttp.status);
        }
      }
    };
    
    xmlhttp.open(verb, url, true);

    if(body) {
      if(typeof(body) === 'object'){
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(body));
      } else {
        xmlhttp.send(body);
      }
      
    } else {
      xmlhttp.send();
    }

    return deferred.promise;
  }

  return {
    maps: maps,
    load: load,
    save: save
  };
});