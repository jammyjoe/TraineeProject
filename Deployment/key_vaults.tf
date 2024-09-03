data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "key_vault" {
    name                        = "${local.resource_name}-kv"
    location                    = azurerm_resource_group.resource_group.location
    resource_group_name         = azurerm_resource_group.resource_group.name
    sku_name                    = "standard"
    tenant_id                   = data.azurerm_client_config.current.tenant_id
    enable_rbac_authorization  = true
    enabled_for_deployment      = true
}

resource "azurerm_key_vault_access_policy" "terraform_kv_ap" {
    key_vault_id = azurerm_key_vault.key_vault.id
    tenant_id    = data.azurerm_client_config.current.tenant_id
    object_id    = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "List", "Delete", "Recover", "Backup", "Restore", "Set", "Purge"
    ]
}

resource "azurerm_key_vault_secret" "storage_account_secret" {
  name         = "PokedexStorageAccount--ConnectionString"
  value        = "azurerm_storage_account.pokedex_storage.primary_connection_string"
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_kv_ap
  ]
}

resource "azurerm_key_vault_secret" "database_secret" {
  name         = "PokedexDatabase--ConnectionString"
  value        = azurerm_mssql_server.pokedex_sqlserver.connection_policy
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_kv_ap
  ]
}

resource "azurerm_key_vault_secret" "admin_password_secret" {
  name         = "PokedexDatabase--AdminPassword"
  value        = var.ADMIN_PASSWORD
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_kv_ap
  ]
}

