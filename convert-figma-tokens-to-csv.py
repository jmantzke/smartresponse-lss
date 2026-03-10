#!/usr/bin/env python3
import json
import csv

# Read the JSON file
with open('enfineitz-figma.tokens.json', 'r') as f:
    data = json.load(f)

# Open CSV file for writing
with open('enfineitz-figma-tokens.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    
    # Write header
    writer.writerow(['Category', 'Token Name', 'Type', 'Description', 'Value Details'])
    
    # Process each category
    for category, tokens in data.items():
        if isinstance(tokens, dict):
            for token_name, token_data in tokens.items():
                if isinstance(token_data, dict):
                    token_type = token_data.get('type', '')
                    description = token_data.get('description', '') or ''
                    value = token_data.get('value', {})
                    
                    # Format value details based on type
                    if isinstance(value, dict):
                        # For complex values, format key properties
                        value_details = []
                        for key, val in value.items():
                            value_details.append(f"{key}: {val}")
                        value_str = " | ".join(value_details)
                    else:
                        value_str = str(value)
                    
                    # Write row
                    writer.writerow([category, token_name, token_type, description, value_str])

print("CSV file created: enfineitz-figma-tokens.csv")
