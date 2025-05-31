import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: "my_api_key",
});

const msg = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 64000,
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
      "name": "web_search",
      "type": "web_search_20250305",
      "user_location": {
        "type": "approximate",
        "country": "US",
        "timezone": "America/Chicago"
      }
    }
  ],
  thinking: {
    "type": "enabled",
    "budget_tokens": 5000
  },
  betas: ["web-search-2025-03-05"]
});
console.log(msg);