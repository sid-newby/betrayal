import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: "my_api_key",
});

const msg = await anthropic.beta.messages.create({
  model: "claude-opus-4-20250514",
  max_tokens: 32000,
  temperature: 1,
  system: "This is the System Prompt. ",
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "This is the Model Request. The Message to the Model, or main Interface to the Agent. "
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "This is where the Agent's response will land. "
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "This is an additional message to the Agent, now including context from the previous three turns "
        }
      ]
    }
  ],
  tools: [
    {
      "type": "custom",
      "name": "get_time",
      "description": "Get the current time in a given location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA."
          }
        },
        "required": [
          "location"
        ]
      }
    },
    {
      "type": "web_search_20250305",
      "name": "web_search",
      "max_uses": 5,
      "user_location": {
        "type": "approximate",
        "city": "Chicago",
        "region": "Illinois",
        "country": "US",
        "timezone": "America/Chicago"
      }
    }
  ],
  thinking: {
    "type": "enabled",
    "budget_tokens": 10000
  }
});
console.log(msg);
