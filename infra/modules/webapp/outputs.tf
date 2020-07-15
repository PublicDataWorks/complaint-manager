output "api_gateway_endpoint" {
  value = aws_apigatewayv2_api.api_gateway.api_endpoint
}

output "database_connection_details" {
  value = regex("://(?P<username>\\w+):(?P<password>\\w+)@(?P<host>[\\w-.]+):\\d+/(?P<database>\\w+)", heroku_app.app.all_config_vars["DATABASE_URL"])
}