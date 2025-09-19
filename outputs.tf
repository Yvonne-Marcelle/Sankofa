output "frontend_url" {
  description = "URL of the Sankofa frontend"
  value       = "http://${aws_s3_bucket.sankofa_frontend.bucket}.s3-website-${var.aws_region}.amazonaws.com"
}

output "api_url" {
  description = "URL of the Sankofa API"
  value       = "${aws_apigatewayv2_api.sankofa_api.api_endpoint}/${var.environment}/synthesize"
}

output "audio_bucket_name" {
  description = "Name of the audio S3 bucket"
  value       = aws_s3_bucket.sankofa_audio.bucket
}

output "frontend_bucket_name" {
  description = "Name of the frontend S3 bucket"
  value       = aws_s3_bucket.sankofa_frontend.bucket
}
