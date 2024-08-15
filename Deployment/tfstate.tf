resource "azurerm_resource_group" "tfstate_rg" {
  name                      = "spokeconnect-rg"
  location                  = "UK South"
  tags = local.tags
  lifecycle {
    ignore_changes = [ 
      tags
     ]
  }
}

resource "azurerm_storage_account" "tfstate_sa" {
  name                     = "tfstatesa"
  resource_group_name      = azurerm_resource_group.tfstate_rg.name
  location                 = azurerm_resource_group.tfstate_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  allow_nested_items_to_be_public = false

  tags = {
    environment = "dev"
  }
}

resource "azurerm_storage_container" "tfstate" {
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.tfstate_sa.name
  container_access_type = "private"
}