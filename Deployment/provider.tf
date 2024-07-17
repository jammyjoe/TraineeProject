# terraform {
#   required_providers {
#     azurerm = {
#       source  = "hashicorp/azurerm"
#       version = "~> 3.97.0"
#     }
#   }

#   backend "azurerm" {
#     container_name = "tfstate"
#     key            = "enpOrderShim.terraform.tfstate"
#   }
# }

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy            = true
      recover_soft_deleted_key_vaults         = true
      purge_soft_deleted_secrets_on_destroy   = true
      recover_soft_deleted_secrets            = true
    }
  }
}