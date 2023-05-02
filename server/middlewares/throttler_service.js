const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 / 600 // 600 requests per minute
});

const queue = [];

function processQueue() {
  if (limiter.queued() > 0 || queue.length === 0) {
    return;
  }

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