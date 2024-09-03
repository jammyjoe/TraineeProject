terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.97.0"
    }
  }

  backend "azurerm" {
    resource_group_name   = "pokedex-rg"
    storage_account_name  = "pokedexterraformsa"
    container_name        = "terraform-state"
    key                   = "terraform.tfstate"
  }
}

provider "azurerm" {
  subscription_id = var.SUBSCRIPTION_ID
  client_id       = var.CLIENT_ID
  client_secret   = var.CLIENT_SECRET
  tenant_id       = var.TENANT_ID

  features {
    key_vault {
      purge_soft_delete_on_destroy            = true
      recover_soft_deleted_key_vaults         = true
      purge_soft_deleted_secrets_on_destroy   = true
      recover_soft_deleted_secrets            = true
    }
  }
}