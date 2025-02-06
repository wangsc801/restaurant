import json
from pypinyin import lazy_pinyin

def generate_abbr(title):
    """
    Generates an abbreviation by taking the first letter of each pinyin syllable of the title.
    
    Args:
        title (str): The title in Chinese characters.
    
    Returns:
        str: The abbreviation in uppercase letters.
    """
    # Convert title to pinyin
    pinyin_list = lazy_pinyin(title)
    # Take the first letter of each pinyin syllable and convert to uppercase
    abbr = ''.join([word[0].upper() for word in pinyin_list if word])
    return abbr

def add_abbreviation_to_menu(input_file, output_file):
    """
    Reads the menu JSON file, adds an 'abbr' field to each item, and writes to a new JSON file.
    
    Args:
        input_file (str): Path to the input JSON file.
        output_file (str): Path to the output JSON file.
    """
    try:
        # Read the original JSON file
        with open(input_file, 'r', encoding='utf-8') as f:
            menu_data = json.load(f)
        
        # Check if the data is a list
        if not isinstance(menu_data, list):
            raise ValueError("JSON data is not a list of objects.")
        
        # Iterate over each menu item and add the 'abbr' field
        for item in menu_data:
            title = item.get('title', '')
            if title:
                abbr = generate_abbr(title)
                item['abbr'] = abbr
            else:
                item['abbr'] = ""
        
        # Write the updated data to the new JSON file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(menu_data, f, ensure_ascii=False, indent=2)
        
        print(f"Abbreviations added successfully. Updated data written to '{output_file}'.")
    
    except FileNotFoundError:
        print(f"Error: The file '{input_file}' does not exist.")
    except json.JSONDecodeError:
        print(f"Error: The file '{input_file}' is not a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    # Define input and output file paths
    input_json = './data/menu_items.json'       # Replace with your input file name
    output_json = 'new_menu.json'  # The output file with abbreviations

    # Add abbreviations to the menu
    add_abbreviation_to_menu(input_json, output_json)
