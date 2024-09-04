param (
    [Parameter(Mandatory = $true)] [string] $resourceGroupName,
    [Parameter(Mandatory = $true)] [string] $storageAccountName
)

cd $env:BUILD_SOURCESDIRECTORY/Deployment


terraform init -backend-config="resource_group_name=$resouceGroupName" -backend-config="storage_account_name=$storageAccountName"
if(!$?) { echo "Unable to init Terraform"; throw "Init Error"}

terraform validate
if(!$?) { echo "Invalid terraform"; throw "Validation Error"}

terraform import azurerm_key_vault_secret.storage_account_secret "https://pokedex-kv.vault.azure.net/secrets/DefaultConnection/736288c5e47249b8acd86289ca454a4b"
terraform import azurerm_key_vault_secret.database_secret "https://pokedex-kv.vault.azure.net/secrets/PokedexDatabase--AdminPassword/a85f3168ddb84f99bda51d66cdbe53b0"
terraform import azurerm_key_vault_secret.admin_password_secret "https://pokedex-kv.vault.azure.net/secrets/StorageAccountConnection/7880efa50416481eb46fd12f52d08bbc"

# terraform import azurerm_resource_group.resource_group /subscriptions/975435ff-d720-4311-8ffc-536ad43592e4/resourceGroups/pokedex-dev-rg
# terraform import azurerm_mssql_server.pokedex_sqlserver /subscriptions/975435ff-d720-4311-8ffc-536ad43592e4/resourceGroups/pokedex-dev-rg/providers/Microsoft.Sql/servers/pokedex-dev-sqlserver
# terraform import azurerm_mssql_database.pokedex_db /subscriptions/975435ff-d720-4311-8ffc-536ad43592e4/resourceGroups/pokedex-dev-rg/providers/Microsoft.Sql/servers/pokedex-dev-sqlserver/databases/pokedex-dev-db
# terraform import azurerm_mssql_firewall_rule.allow_client_ip /subscriptions/975435ff-d720-4311-8ffc-536ad43592e4/resourceGroups/pokedex-dev-rg/providers/Microsoft.Sql/servers/pokedex-dev-sqlserver/firewallRules/allow-client-ip

terraform plan -out "terraform.deployment.tfplan" | tee terraform_plan_output.txt
if(!$?) { echo "Terraform plan failed"; throw "Plan Error"}

terraform apply "terraform.deployment.tfplan"

