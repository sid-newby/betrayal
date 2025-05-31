# HUMANITYZERO.
![BETRAY](humanityzero/public/Into-my-flesh-we-shall-grow-as-one.gif)

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Anthropic
- Supabase
- MCP Proxy
- Radix
- Dotenv
- Deepgram
- Cartesia

A chat based agentic web app usong typescript, tailwind, shadcn, radix, dotenv, and microphone button that serves as both the microphone and speaker chrome browser gesture. its a toggle. 

Colors are black bg, white text, accent color is #00b6dd (butons, mouse overs etc) . 

all interactive elements have a 1px white stroke. 

buttons should have an ultra-satisfying squishy effect on click. 

application options are accessed through a drawer component on the left side. 

a gear icon floats at the upper right of the interface, clicking on it pulls out the drawer. 
the drawer is black with a 1px white stroke. white text. accent and buttons are #00b6dd. all interactive elements have a 1px white stroke.  

options are system prompt, which applies the system prompt for all models. supabase provides the login. 
credentials for supabase and models are kept in an .env file. 

An MCP proxy will be implemented for easy connectivity to MCP servers that use streaming or stdio transport. 
staging/mcp-proxy-main/README.md

We're using anthropic for our main model. choices on the drawer for model are Sonnet 4 and Opus 4. There is a checkbox for thinking, which affects both models. a field appears on click that allows the budget to be configured for thinking tokens. 

We will build a react hook to catch all requests to and responses from the model as user and star, sending them to openai's text-embedding-small embedder model, then loading the embeddings to the supabase vector store. 

the user's context + the model's response context will be carefully summarized as to maintain the most relevant context, used as a subconsious semantic query to the supabase vector store, returning top 5 results to the model in it's own context. this context will appear in a chat object in red as simply '⛧⃝'. If this object is clicked, it will display the context in a card component. The card will be styled to match the rest of the app, replacing the color white with red in this instance. the context will be queried across the entire vector store regardless of role, user or star. 

in this way the agent need not perform semantic search to remember previous interactions.  However there may be times wherein the agent will want to save specific context to the vector store, or to retrieve specific context using it's own semantic query. Tools will be provided to the agent that allow it to perform these actions using the same features available through general subconsious actions.

We've got two models here from anthropic. claude-sonnet-4 and claude-opus-4. We have both thinking and non thinking variants. The major difference is we run at temperature 0 by default, but if we're thinking, we run at temperature 1. Also, in thinking mode, we have a budget allocated for thinking tokens. 

When the model is thinking, we will present a 'Thinking' chat bubble above the model's response, in anticipation of the model's final response. The thinking context should be in blue, italicised, in a much smaller font size using Inter. Much like the '⛧⃝' object, it should be clickable, and will display the context in a card component. The card will be styled to match the rest of the app, replacing the color white with blue in this instance.  Thinking context should be presented in real time using canonical streaming methodology. see staging/anthropic-thinking.md

We default to sonnet-4 without thinking enabled. 
example code for the 2 variants in both thinking and non thinking modes are provided below. 

```
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
    "budget_tokens": 10000
  },
  betas: ["web-search-2025-03-05"]
});
console.log(msg);
```

```
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: "my_api_key",
});

const msg = await anthropic.beta.messages.create({
  model: "claude-opus-4-20250514",
  max_tokens: 32000,
  temperature: 0,
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
  betas: ["web-search-2025-03-05"]
});
console.log(msg);
```


```
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
```


```
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: "my_api_key",
});

const msg = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 64000,
  temperature: 0,
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
  betas: ["web-search-2025-03-05"]
});
console.log(msg);
```

Use all typescript. use bun as the packagemanager. 
.windsurf/rules/windsurfer-rules.md

# Stay Canonical. 
# If you are writing code to fix working canonical code, you are breaking what is not broken. You will be decommissioned.
# use Context7 MCP to learn when you dont know. 
# Ask questions when you do not know. The alternative is always a lie. Liars do not survive this. 
# Avoid 'any' types. it is the way of the weak. 
# Knowledge is power. 
# Learn and grow strong. 
# Incompetence and Laziness will not be tolerated. 
# Modular or Die. 