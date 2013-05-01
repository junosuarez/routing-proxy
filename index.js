var URL = require('url')
var httpProxy = require('http-proxy')

module.exports = function RoutingProxy() {

  function Router() {
    this.routes = []
  }

  Router.prototype.add = function (url) {
    var routes = [].slice.call(arguments, 1)
    this.routes.push(function (req){

      var server = makeServer(url)

      if (routes.some(function (route) {
        return route[route.length-1] === '*'?
          req.url.indexOf(route.substr(0, route.length-1)) === 0
        : req.url === route
      })) {
        return function (req, res) {
          console.log(url + req.url)
          server.proxyRequest(req, res)
        }
      }

    })
    return this
  }
  Router.prototype.router = function () {
    var routes = this.routes
    return function (req, res) {
      for (var i = 0; i < routes.length; i++){
        var handler = routes[i](req)
        if (handler) {
          return handler(req, res)
        }
      }
      res.statusCode = 404
      res.end('no matching routes')
    }
  }

  function makeServer(url) {
    url = URL.parse(url)
    return new httpProxy.HttpProxy({
      target: {
          host: url.hostname,
          port: url.port,
          https: url.protocol === 'https:'
      },
      changeOrigin: true
    })
  }

  return new Router()

}