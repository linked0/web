import requests
from dotenv import load_dotenv
import os

def getEtherescan(address):
    """
    Get the Etherscan URL for a given Ethereum address.
    
    Args:
        address (str): The Ethereum address to look up.
        
    Returns:
        str: The Etherscan URL for the address.
    """
    # call requests to get the Etherscan URL
    load_dotenv()  # Load environment variables from a .env file

    api_key = os.getenv("ETHERSCAN_API_KEY")
    if not api_key:
      raise ValueError("ETHERSCAN_API_KEY is not set in the environment variables")

    try:
        response = requests.get(address + api_key)
        response.raise_for_status()  # Raise an error for bad responses
        return response.text
    except requests.exceptions.RequestException as e:
        return f"Error fetching data from Etherscan: {e}"

if __name__ == "__main__":
    # Example usage
    address = "https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=20000000000&apikey="
    print(getEtherescan(address))
