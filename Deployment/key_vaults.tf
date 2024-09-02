# resource "azurerm_key_vault" "key_vault" {
#     name                        = "${local.resource_group}-${local.env_name}-kv"
#     location                    = azurerm_resource_group.resource_group.location
#     resource_group_name         = azurerm_resource_group.resource_group.name
#     sku_name                    = "standard"
#     tenant_id                   = data.azurerm_client_config.current.tenant_id
#     enabled_for_deployment      = true

#   access_policy {
#     tenant_id = data.azurerm_client_config.current.tenant_id
#     object_id  = data.azurerm_client_config.current.object_id

#     key_permissions    = ["get", "list"]
#     secret_permissions = ["get", "list", "set"]
#   }
# }

# resource "azurerm_key_vault_secret" "storage_account_secret" {
#   name         = "PokedexStorageAccount--ConnectionString"
#   value        = azurerm_storage_account.storage_account.primary_connection_string
#   key_vault_id = azurerm_key_vault.key_vault.id

#   depends_on = [
#     azurerm_key_vault_access_policy.terraform_kv_ap
#   ]
# }
