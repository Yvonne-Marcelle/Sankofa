# 🔄 Sankofa - Text to Speech Application

![AWS](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazonaws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?logo=terraform&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9-blue?logo=python&logoColor=white)

A cloud-native text-to-speech application built with AWS serverless infrastructure. "Sankofa" means "go back and get it" - representing the retrieval of voice from text.

## ✨ Features

- 🎙️ Multiple Amazon Polly neural voices
- 📁 MP3, OGG, and PCM output formats
- ⚡ Real-time audio generation
- 📱 Responsive web interface
- 🌐 RESTful API for integration
- 🔒 Secure AWS infrastructure

## 🚀 Quick Deployment

```bash
# Initialize Terraform
terraform init

# Deploy infrastructure
terraform apply -auto-approve

# Get application URLs
echo "Frontend: $(terraform output -raw frontend_url)"
echo "API: $(terraform output -raw api_url)"
