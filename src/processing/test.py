import json

def main():
    # Receive a JSON string from Node.js and parse it
    data = input()
    # Convert the JSON string to a Python dictionary
    data = json.loads(data)
    # Process the data
    data["python"] = "Hello from Python!"
    # convert the Python dictionary to a JSON string
    data = json.dumps(data)
    # Send the JSON string to Node.js
    print(data)

if __name__ == "__main__":
    main()