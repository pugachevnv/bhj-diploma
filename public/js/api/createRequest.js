/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let formData = new FormData();
    xhr.responseType = 'json';

    // url
    sendUrl = options.url;
    // data
    if (options.method === 'GET') {
        sendUrl = options.url + '?';
        for (let key in options.data) {
            sendUrl += key + '=' + options.data[key] + '&';
        }
        sendUrl.slice(0, -1);

        xhr.open(options.method, sendUrl);
        xhr.send()

    } else {
        formData = new FormData();
        for (let key in options.data) {
            formData.append(key, options.data[key])
        }

        xhr.open(options.method, sendUrl);
        xhr.send(formData);
    }
    
    // metod (options.method)
    
    // callback
    xhr.addEventListener("load", (e) => {
        if (xhr.response.success) {
            options.callback(null, xhr.response);
            console.log(xhr.response);
        }
        else {
            options.callback(new Error(xhr.response.error), null);
        }
    });

    try {
        xhr.open( options.method, sendUrl );
        xhr.send( formData );
    } catch ( e ) {
        // перехват сетевой ошибки
        callback( e );
    }
};
