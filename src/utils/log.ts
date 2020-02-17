function log(...params: any[]) {
  // enough for now
  console.debug.call(this, params);
}

module.exports = log;