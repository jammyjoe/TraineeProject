data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "key_vault" {
    name                        = "${local.service_name}-${local.env_name}-kv"
    location                    = azurerm_resource_group.resource_group.location
    resource_group_name         = azurerm_resource_group.resource_group.name
    sku_name                    = "standard"
    tenant_id                   = data.azurerm_client_config.current.tenant_id
    enabled_for_deployment      = true

    tags = local.tags
}

resource "azurerm_key_vault_secret" "storage_account_secret" {
  name         = "SapQueue--ConnectionString"
  value        = azurerm_storage_account.storage_account.primary_connection_string
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_kv_ap
  ]
}

resource "azurerm_key_vault_secret" "sap_username_secret" {
  name         = "SapCredentials--Username"
  value        = var.SAP_USERNAME
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_kv_ap
  ]
}

resource "azurerm_key_vault_secret" "sap_password_secret" {
  name         = "SapCredentials--Password"
  value        = var.SAP_PASSWORD
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_kv_ap
  ]
}

resource "azurerm_key_vault_secret" "eventhub_secret" {
  name         = "EventHubLogging--ConnectionString"
  value        = azurerm_eventhub_namespace_authorization_rule.send.primary_connection_string
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_kv_ap
  ]
}
 
resource "azurerm_key_vault_access_policy" "terraform_kv_ap" {
    key_vault_id = azurerm_key_vault.key_vault.id
    tenant_id    = data.azurerm_client_config.current.tenant_id
    object_id    = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Get", "List", "Update", "Create", "Import", "Delete", "Recover", "Backup", "Restore", "Purge"
    ]

    secret_permissions = [
      "Get", "List", "Delete", "Recover", "Backup", "Restore", "Set", "Purge"
    ]

    certificate_permissions = [
      "Get", "List", "Update", "Create", "Import", "Delete", "Recover", "Backup", "Restore", "DeleteIssuers", "GetIssuers", "ListIssuers", "ManageContacts", "ManageIssuers", "SetIssuers", "Purge"
    ]
}

resource "azurerm_key_vault_access_policy" "sapproxywebapp_kv_ap" {
    key_vault_id  = azurerm_key_vault.key_vault.id
    tenant_id     = data.azurerm_client_config.current.tenant_id
    object_id     = azurerm_windows_web_app.sapproxywebapp.identity[0].principal_id 

    key_permissions = [
      "Get",
      "List"
    ]

    secret_permissions = [
      "Get",
      "List"
    ]

    certificate_permissions = [
      "Get",
      "List"
    ]
}