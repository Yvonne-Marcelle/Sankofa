import json
import boto3
import uuid
from datetime import datetime
import os
import logging
import traceback

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("=== SANKOFA TTS START ===")
    
    try:
        # Get bucket name from environment
        bucket_name = os.environ.get('BUCKET_NAME')
        logger.info(f"Bucket: {bucket_name}")
        
        if not bucket_name:
            return error_response(500, 'Bucket name not configured')
        
        # Parse request
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            body = event
            
        text = body.get('text', '')
        voice_id = body.get('voiceId', 'Joanna')
        output_format = body.get('outputFormat', 'mp3')
        engine = body.get('engine', 'neural')
        
        if not text:
            return error_response(400, 'Text is required')
        
        if len(text) > 3000:
            return error_response(400, 'Text exceeds maximum length of 3000 characters')
        
        # Synthesize speech with Polly
        polly = boto3.client('polly')
        response = polly.synthesize_speech(
            Text=text,
            OutputFormat=output_format,
            VoiceId=voice_id,
            Engine=engine
        )
        logger.info("Polly synthesis successful")
        
        # Generate filename
        filename = f"{voice_id}_{uuid.uuid4()}.{output_format}"
        logger.info(f"Filename: {filename}")
        
        # Upload to S3
        s3 = boto3.client('s3')
        audio_data = response['AudioStream'].read()
        s3.put_object(
            Bucket=bucket_name,
            Key=filename,
            Body=audio_data,
            ContentType=f'audio/{output_format}'
        )
        logger.info("S3 upload successful")
        
        # Generate presigned URL
        audio_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': filename},
            ExpiresIn=3600
        )
        logger.info(f"Presigned URL generated")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'audioUrl': audio_url,
                'filename': filename,
                'voiceId': voice_id,
                'timestamp': datetime.utcnow().isoformat()
            })
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        logger.error(traceback.format_exc())
        return error_response(500, f'Internal error: {str(e)}')

def error_response(status_code, message):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        'body': json.dumps({'error': message})
    }
