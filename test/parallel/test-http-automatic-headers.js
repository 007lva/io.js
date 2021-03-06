var common = require('../common');
var assert = require('assert');
var http = require('http');

var server = http.createServer(function(req, res) {
  res.setHeader('X-Date', 'foo');
  res.setHeader('X-Connection', 'bar');
  res.setHeader('X-Transfer-Encoding', 'baz');
  res.end();
});
server.listen(common.PORT);

server.on('listening', function() {
  var agent = new http.Agent({ port: common.PORT, maxSockets: 1 });
  http.get({
    port: common.PORT,
    path: '/hello',
    agent: agent
  }, function(res) {
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['x-date'], 'foo');
    assert.equal(res.headers['x-connection'], 'bar');
    assert.equal(res.headers['x-transfer-encoding'], 'baz');
    assert(res.headers['date']);
    assert.equal(res.headers['connection'], 'keep-alive');
    assert.equal(res.headers['transfer-encoding'], 'chunked');
    server.close();
    agent.destroy();
  });
});
