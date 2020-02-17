function value(v = '') {
  return JSON.stringify(v);
}

module.exports = {
  LOCAL_CHAIN_URL: value('http://localhost:9334')
};