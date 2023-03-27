# Define the IAM user name
$iam_user_name = "EKSLab_Admin"

# Get the list of IAM policies attached to the user
$attached_policies = aws iam list-attached-user-policies `
  --user-name $iam_user_name `
  --query 'AttachedPolicies[*].PolicyName' `
  --output text

# Check if the AmazonDynamoDBFullAccess policy is attached to the user
if ($attached_policies -like "*AmazonDynamoDBFullAccess*") {
  Write-Host "The IAM user $iam_user_name has access to AmazonDynamoDBFullAccess."
} else {
  Write-Host "The IAM user $iam_user_name does not have access to AmazonDynamoDBFullAccess."
}
