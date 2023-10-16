import openai
from aiohttp import ClientSession

openai.api_key = ''

openai.aiosession.set(ClientSession())

response = openai.ChatCompletion.acreate(
    model="gpt-4",
    messages=[
        {"role": "system", "content": f"Translate the following text to {target_language}"},
        {"role": "user", "content": text},
    ],
    temperature=1,
)

openai.aiosession.get().close()


print(response.choices[0].message.content.strip())