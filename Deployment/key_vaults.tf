data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "key_vault" {
    name                        = "${local.resource_name}-kv"
    location                    = azurerm_resource_group.resource_group.location
    resource_group_name         = azurerm_resource_group.resource_group.name
    sku_name                    = "standard"
    tenant_id                   = data.azurerm_client_config.current.tenant_id

    access_policy {
        tenant_id = data.azurerm_client_config.current.tenant_id
        object_id = data.azurerm_client_config.current.object_id

        secret_permissions = [
        "Get", "List", "Delete", "Recover", "Backup", "Restore", "Set", "Purge"
    ]
    }
    lifecycle {
        ignore_changes = [
            access_policy
        ]
    }
}

resource "azurerm_key_vault_secret" "storage_account_secret" {
  name         = "StorageAccountConnection"
  value        = var.SA_CONNECTION_STRING
  key_vault_id = azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "database_secret" {
  name         = "DefaultConnection"
  value        = var.SQL_DB_CONNECTION_STRING
  key_vault_id = azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "admin_password_secret" {
  name         = "AdminPassword"
  value        = var.ADMIN_PASSWORD
  key_vault_id = azurerm_key_vault.key_vault.id
}