output "elasticsearch_https_endpoint" { 
  value = ec_deployment.ec-deployment.elasticsearch[0].https_endpoint 
} 
output "elasticsearch_username" { 
  value = ec_deployment.ec-deployment.elasticsearch_username 
}
output "elasticsearch_password" { 
  value = ec_deployment.ec-deployment.elasticsearch_password 
}