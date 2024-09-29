import json
import csv

def lambda_handler(event, context):
    method = event.get("requestContext").get("http").get("method")
    if method == "OPTIONS":
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            },
            'body': ""
        }
        
    body = json.loads(event.get('body', '{}'))
    csv_row = body.get("csv_row", "")
    
    if csv_row == "":
        return {
            'statusCode': 204,
            'body': ""
        }
    
    if not csv_row:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({"error": "CSV row not provided"})
        }

    parsed_row = list(csv.reader([csv_row]))[0]
    return_data = {
        "bucket": parsed_row[0],
        "offline_room": parsed_row[1],
        "flight": parsed_row[2],
        "first_team": parsed_row[3],
        "second_team": parsed_row[6],
        "judges": [judge for judge in parsed_row[10:] if judge != ""]
    }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        'body': return_data
    }
