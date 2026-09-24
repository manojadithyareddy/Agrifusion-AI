from typing import Dict, Any, List
from pydantic import BaseModel, ValidationError

def validate_data(data: Dict[str, Any], schema: type[BaseModel]) -> tuple[bool, Dict[str, Any] | List[Dict[str, Any]]]:
    """
    Validates a dictionary against a Pydantic schema.
    Returns a tuple of (is_valid, data_or_errors).
    If valid, returns (True, validated_data).
    If invalid, returns (False, list_of_errors).
    """
    try:
        validated_data = schema.model_validate(data)
        return True, validated_data.model_dump()
    except ValidationError as e:
        return False, e.errors()

def validate_bulk_data(data_list: List[Dict[str, Any]], schema: type[BaseModel]) -> tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Validates a list of dictionaries against a Pydantic schema.
    Returns a tuple of (valid_items, errors_list).
    """
    valid_items = []
    errors = []
    
    for idx, item in enumerate(data_list):
        is_valid, result = validate_data(item, schema)
        if is_valid:
            valid_items.append(result)
        else:
            errors.append({
                "index": idx,
                "item": item,
                "errors": result
            })
            
    return valid_items, errors
