resource "aws_dynamodb_table" "gamer_bounty" {
  name           = "gamerBounty"
  read_capacity  = 5
  write_capacity = 5

  attribute {
    name = "contractNumber"
    type = "S"
  }

  attribute {
    name = "gameName"
    type = "S"
  }

  attribute {
    name = "targetName"
    type = "S"
  }

  attribute {
    name = "contractConditions"
    type = "S"
  }

  attribute {
    name = "bidAmount"
    type = "N"
  }

  attribute {
    name = "multiSubmit"
    type = "S"
  }

  attribute {
    name = "multiBid"
    type = "S"
  }

  attribute {
    name = "contentLink"
    type = "S"
  }

  attribute {
    name = "requestedBy"
    type = "S"
  }

  attribute {
    name = "acceptedBy"
    type = "S"
  }

  attribute {
    name = "contractStatus"
    type = "S"
  }

  key {
    name = "contractNumber"
    type = "HASH"
  }

  key {
    name = "gameName"
    type = "RANGE"
  }
}
