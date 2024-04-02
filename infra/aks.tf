resource "azurerm_kubernetes_cluster" "k8s" {
  name                = "${var.prefix}-aks"
  location            = var.region
  resource_group_name = azurerm_resource_group.rg-1.name
  dns_prefix          = var.prefix

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "dev"
  }

  linux_profile {
    admin_username = "ayub"

    ssh_key {
      key_data = file(var.ssh_key)
    }
  }

  #   service_principal {
  #     client_id     = var.client_id
  #     client_secret = var.client_secret
  #   }

  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }

  #   addon_profile {
  #     kube_dashboard {
  #       enabled = true
  #     }
  #   }
}