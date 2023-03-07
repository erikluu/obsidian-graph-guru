import asyncio
import json
import websockets

messages = []

async def process_messages(websocket, path):
    global messages
    async for message in websocket:
        data = json.loads(message)
        messages.append(data['message'])

async def main():
    # Start the WebSocket server
    async with websockets.serve(process_messages, "localhost", 8765):
        # Wait for messages to come in
        while True:
            message = input("Enter message: ")
            if not message:
                break
            data = {'message': message}
            message_json = json.dumps(data)
            async with websockets.connect('ws://localhost:8765') as websocket:
                await websocket.send(message_json)

        # Signal the processing coroutine to stop
        async with websockets.connect('ws://localhost:8765') as websocket:
            await websocket.send(json.dumps({'message': None}))
            

asyncio.run(main())

print(messages)  # Print the collected messages
