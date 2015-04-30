'use strict';

var BitcoreNode = require('./lib/node');
BitcoreNode.errors = require('./lib/errors');
var BitcoreHTTP = require('./api/lib/http');
var bitcore = require('bitcore');
var Promise = require('bluebird');
Promise.longStackTraces();


if (require.main === module) {
  var config = require('config');
  var nodeConfig = config.get('BitcoreHTTP.BitcoreNode');
  var httpConfig = config.get('BitcoreHTTP');
  var network = nodeConfig.network;
  console.log('Starting bitcore-node-http', network, 'network');
  bitcore.Networks.defaultNetwork = bitcore.Networks.get(network);
  var node = BitcoreNode.create(nodeConfig);
  node.on('error', function(err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('Connection to bitcoind failed');
    } else {
      console.log('Error: ', err);
    }
  });
  process.on('SIGINT', function() {
    node.stop();
    process.exit();
  });
  var http = new BitcoreHTTP(node, httpConfig);
  http.start()
    .catch(function(err) {
      http.stop();
      throw err;
    });
}

module.exports = BitcoreNode;
