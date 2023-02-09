import asyncio

async def process_input(input_data):
    # Perform processing on the input data
    processed_data = input_data.upper()
    return processed_data

async def main():
    input_data = input("")
    processed_data = await process_input(input_data)
    print(f"{processed_data}")

if __name__ == "__main__":
    asyncio.run(main())

