const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100
});

const queue = [];

function processQueue() {
  const { request, resolve, reject } = queue.shift();
  limiter.schedule(() => request())
    .then(resolve)
    .catch(reject);
}

module.exports = {
  addRequest: (request) => {
    return new Promise((resolve, reject) => {
      queue.push({ request, resolve, reject });
      processQueue();
    });
  }
};