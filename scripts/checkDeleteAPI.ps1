# Specify the API endpoint URL and the contract number to delete
$url = "http://localhost:3000/api/deleteContract?contractNumber=6969"

# Send a DELETE request to the API endpoint
$response = Invoke-RestMethod -Uri $url -Method Delete

# Check if the request was successful
if ($response.success -eq $true) {
    Write-Host "Contract deleted successfully!"
} else {
    Write-Host "Error deleting contract: $($response.error)"
}
