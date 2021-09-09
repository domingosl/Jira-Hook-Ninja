import Noty from "noty";

module.exports = (type, message, timeout = 3000) => {

    new Noty({
        type: type,
        layout: 'topCenter',
        text: message,
        timeout,
        theme: 'solarized'
    }).show();

}