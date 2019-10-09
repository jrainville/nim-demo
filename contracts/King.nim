import nimplay0_1


contract("KingOfTheHill"):

  # Globals
  var
    king_name*: bytes32
    king_addr*: address
    king_value*: wei_value

  # Events
  proc BecameKing(name: bytes32, value: uint128) {.event.}

  # Methods
  proc becomeKing*(name: bytes32) {.payable,self,msg,log.} =
    if msg.value > self.king_value:
      self.king_name = name
      self.king_addr = msg.sender
      self.king_value = msg.value
      log.BecameKing(name, msg.value)
