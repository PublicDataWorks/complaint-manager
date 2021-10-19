output "api_gateway_endpoint" {
  value = aws_apigatewayv2_api.api_gateway.api_endpoint
}

output "database_connection_details" {
  value = regex(var.database_connection_regex, heroku_app.app.all_config_vars["DATABASE_URL"])
  sensitive = true
}