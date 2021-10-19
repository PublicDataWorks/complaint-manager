output "api_gateway_endpoint" {
  value = module.webapp.api_gateway_endpoint
}

output "database_connection_details" {
  value = module.webapp.database_connection_details
  sensitive = true
}