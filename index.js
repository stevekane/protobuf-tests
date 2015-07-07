'use strict'

var Protobuf = require('protobufjs')
var clone = require('clone')
var ByteBuffer = Protobuf.ByteBuffer

var log = console.log.bind(console)
var contains = function (array, obj) {
  return array.indexOf(obj) > -1
}

var STATES = Object.freeze({
  Active: 0,
  Inactive: 1
})
var idGenerator = new IdGen
var stateBuffer = ByteBuffer.allocate(1024)

function* IdGen () {
  var id = 0

  while (true) yield id++
}

var GameStateProto = Protobuf.protoFromFile("GameState.proto")
var GameStateBuf = GameStateProto.build("GameState")

function patch (obj, patch) {
  for (key in patch) {
    obj[key] = patch[key]
  }
}

function encode (byteBuffer, ProtoDef, data) {
  return new ProtoDef(data).encode(byteBuffer).flip().toArrayBuffer()
}

function User (name, state) {
  this.id = idGenerator.next().value
  this.name = name
  this.state = state
}

var user = new User("Steve", STATES.Active)
var users = [user]

//Update the server's state here
user.name = "Lynn"

var encoded = encode(stateBuffer, GameStateBuf, users)

var asJson = JSON.stringify(users)

log(encoded.byteLength)
log(Buffer.byteLength(asJson, 'utf-8'))
log(Buffer.byteLength(asJson, 'ascii'))
log(GameStateBuf.decode(encoded))
