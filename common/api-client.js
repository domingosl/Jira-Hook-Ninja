let runningRequests = 0;

let resolver;

module.exports.setResolver = (fn) => resolver = fn;

module.exports.call = async (endpoint, method, payload) => {

    runningRequests++;
    const response = await resolver(endpoint, method, payload);
    runningRequests--;

    return response;

};


module.exports.runningRequests = runningRequests;