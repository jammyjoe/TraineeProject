param (
    [Parameter(Mandatory = $true)] [string] $resourceGroupName,
    [Parameter(Mandatory = $true)] [string] $storageAccountName
)

cd $env:BUILD_SOURCESDIRECTORY/Deployment

terraform init -backend-config="resource_group_name=$resouceGroupName" -backend-config="storage_account_name=$storageAccountName"
if(!$?) { echo "Unable to init Terraform"; throw "Init Error"}

terraform validate
if(!$?) { echo "Invalid terraform"; throw "Validation Error"}

# terraform import azurerm_key_vault_secret.authority_secret "https://pokedex-kv.vault.azure.net/secrets/Authority/08248c96ec0b4b0f8cf0e69f3022f531"

terraform plan -out "terraform.deployment.tfplan" | tee terraform_plan_output.txt
if(!$?) { echo "Terraform plan failed"; throw "Plan Error"}

terraform apply "terraform.deployment.tfplan"

