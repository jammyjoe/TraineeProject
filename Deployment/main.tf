
resource "azurerm_resource_group" "resource_group" {
  name                            = "${local.resource_name}-${local.env_name}-${local.resource_group}"
  location                        = "UK South"
#   tags = local.tags
#   lifecycle {
#     ignore_changes = [ 
#       tags
#      ]
#   }
}

resource "azurerm_service_plan" "appserviceplan" {
  name                = "${local.resource_name}-${local.env_name}-asp"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  os_type             = "Windows"
  sku_name            = "F1"
  worker_count        = "2" ##Check out

  tags = local.tags
}

resource "azurerm_mssql_server" "pokedex_sqlserver" {
  name                         = "${local.resource_name}-${local.env_name}-${local.sql_server_name}"
  resource_group_name          = azurerm_resource_group.resource_group.name
  location                     = azurerm_resource_group.resource_group.location
  administrator_login          = "${local.admin_username}"
  administrator_login_password = "${local.admin_password}"
  version                      = "12.0"
}

resource "azurerm_mssql_database" "pokedex_db" {
  name      =  "${local.resource_name}-${local.env_name}-${local.sql_db_name}"
  server_id = azurerm_mssql_server.pokedex_sqlserver.id
}

resource "azurerm_app_service" "pokedex_webapi" {
  name                          = "${local.resource_name}-${local.env_name}-${local.web_api}"
  location                      = azurerm_resource_group.resource_group.location
  resource_group_name           = azurerm_resource_group.resource_group.name
  app_service_plan_id           = azurerm_service_plan.appserviceplan.id
  https_only                    = false
  
  site_config { 
    always_on = true
    dotnet_framework_version = "v8.0"
  }

  app_settings = {
    #"AzureVault__Uri"                   = azurerm_key_vault.key_vault.vault_uri
    "SQL_CONNECTION_STRING" = "Server=tcp:${azurerm_sql_server.pokedex_sql_server.name}.database.windows.net;Database=${azurerm_sql_database.pokedex_db.name};User ID=sqladmin;Password=P@ssword1234;Encrypt=true;Connection Timeout=30;"
    "WEBSITE_ENABLE_SYNC_UPDATE_SITE"   = "true" 
    "WEBSITE_RUN_FROM_PACKAGE"          = "1"
  }
}

resource "azurerm_app_service" "pokedex_webapp" {
  name                          = "${local.resource_name}-${local.env_name}-${local.web_app}"
  location                      = azurerm_resource_group.resource_group.location
  resource_group_name           = azurerm_resource_group.resource_group.name
  app_service_plan_id           = azurerm_service_plan.appserviceplan.id

  site_config {
    app_command_line = "npm start"
  }
  
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "API_URL" = "https://${azurerm_app_service.pokedex_webapi.default_site_hostname}"

  }
}