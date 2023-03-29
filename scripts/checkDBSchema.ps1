$tableName = "gamerBounty"

# Get the region from the default profile
$region = (aws configure get region --output text)

# Get the table description
$tableDescription = aws dynamodb describe-table `
  --table-name $tableName `
  --query "Table.{ KeySchema: KeySchema[].AttributeName, AttributeDefinitions: AttributeDefinitions[].AttributeName }" `
  --region $region `
  --output json

# Output the table schema
Write-Host "The table schema for $tableName is:"
$tableDescription
