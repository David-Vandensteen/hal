-------------------------------------------------------------------------
-- H.A.L lua client
-- David Vandensteen
-- MIT
--------------------------------------------------------------------------

local socket  = require("socket.core")

function main(host, port)
  tcp = assert(socket.tcp())
  tcp:connect(host, port)
  tcp:settimeout(10)

  tcp:send('hello')
  message = tcp:receive(1)
  print(message)
  tcp:send('get')
  tcp:receive()
end

main("127.0.0.1", 7070)