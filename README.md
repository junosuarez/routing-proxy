# routing-proxy
route http requests to servers based on url path

## stability
currently used as a dev tool. use in production at your own risk.

## usage

    var http = require('http')
    var RoutingProxy = require('routing-proxy')

    http.createServer(RoutingProxy()
      .add('http://localhost:8009',
        '/',
      )
      .add('https://localhost:8008',
        '/api*',
        '/socket.io*',
        '/login',
        '/logout'
      )
      .add('http://localhost:8081',
        '*'
      )
      .router())
    .listen(8000)

## contributors

jden <jason@denizac.org>

## license

MIT. (c) 2013 Agile Diagnosis <hello@agilediagnosis.com>. See LICENSE.md