
resource "azurerm_resource_group" "resource_group" {
  name                            = "${local.resource_name}-${local.resource_group}"
  location                        = "UK South"
  tags = local.tags
  lifecycle {
    ignore_changes = [ 
      tags
     ]
  }
}

# resource "azurerm_storage_account" "sa" {
#   name                     = "pokedexterraformsa"
#   resource_group_name      = azurerm_resource_group.resource_group.name
#   location                 = azurerm_resource_group.resource_group.location
#   account_tier             = "Standard"
#   account_replication_type = "LRS"
# }

# resource "azurerm_storage_container" "tfstate" {
#   name                  = "tfstate"
#   storage_account_name  = azurerm_storage_account.sa.name
#   container_access_type = "private"
# }

resource "azurerm_storage_account" "pokedex_storage" {
  name                     = "pokedeximgstorage"
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "pokemon_images" {
  name                  = "pokedeximgcontainer"
  storage_account_name  = azurerm_storage_account.pokedex_storage.name
  container_access_type = "blob"  
}

resource "azurerm_mssql_server" "pokedex_sqlserver" {
  name                         = "${local.resource_name}-${local.sql_server_name}"
  resource_group_name          = azurerm_resource_group.resource_group.name
  location                     = azurerm_resource_group.resource_group.location
  administrator_login          = "${local.admin_username}"
  administrator_login_password = var.ADMIN_PASSWORD
  version                      = "12.0"
}

 resource "azurerm_mssql_firewall_rule" "allow_client_ip" {
  name                = "allow-client-ip"
  start_ip_address    = "62.172.108.16" 
  end_ip_address      = "62.172.108.16"
  server_id           = azurerm_mssql_server.pokedex_sqlserver.id
}

resource "azurerm_mssql_database" "pokedex_db" {
  name                =  "${local.resource_name}-${local.sql_db_name}"
  server_id           = azurerm_mssql_server.pokedex_sqlserver.id
  collation           = "Latin1_General_CI_AS"
  sku_name            = "Basic" 
  }

resource "azurerm_service_plan" "appserviceplan" {
  name                = "${local.resource_name}-asp"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  os_type             = "Windows"
  sku_name            = "B1"
  worker_count        = "1" 

  tags = local.tags
}

resource "azurerm_windows_web_app" "pokedex_webapp" {
  name                          = "${local.resource_name}-${local.web_app}"
  service_plan_id               = azurerm_service_plan.appserviceplan.id
  location                      = azurerm_resource_group.resource_group.location
  resource_group_name           = azurerm_resource_group.resource_group.name

   site_config {
    app_command_line = "npm start"
    application_stack {
       current_stack = "node"
       node_version = "~20"
    }
   }
  
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
  }
}

resource "azurerm_windows_web_app" "pokedex_webapi" {
  name                          = "${local.resource_name}-${local.web_api}"
  location                      = azurerm_resource_group.resource_group.location
  resource_group_name           = azurerm_resource_group.resource_group.name
  service_plan_id               = azurerm_service_plan.appserviceplan.id            
  https_only                    = false
  
  identity {
    type = "SystemAssigned"
  }

  site_config { 
    application_stack {
      dotnet_version  = "v8.0"
      current_stack = "dotnet"
    }
    cors {
      allowed_origins = ["https://${azurerm_windows_web_app.pokedex_webapp.name}.azurewebsites.net"]   
    }
  }
  
  app_settings = {
    ASPNETCORE_ENVIRONMENT              = "Production"
    "WEBSITE_ENABLE_SYNC_UPDATE_SITE"  = "true" 
    "WEBSITE_RUN_FROM_PACKAGE"         = "1"
  }
}

#  resource "azurerm_mssql_firewall_rule" "allow_api" {
#   name                = "allow-client-ip"
#   start_ip_address    = azurerm_windows_web_app.pokedex_webapi.outbound_ip_addresses
#   end_ip_address      = azurerm_windows_web_app.pokedex_webapi.outbound_ip_addresses
#   server_id           = azurerm_mssql_server.pokedex_sqlserver.id
# }