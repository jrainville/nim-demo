import nimplay0_1

contract("SimpleStorageNim"):

  var
    storedData*: uint256 = 100
  proc set*(x: uint256) {.self.} =
    self.storedData = x
  proc get*(): uint256 {.self.} =
    self.storedData
