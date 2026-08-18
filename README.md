# Gmail AI Agent

An AI agent that automatically analyzes Gmail emails and assigns appropriate labels.

## 🛠️ Tech Stack

- **Bun & TypeScript**
- **Google Gmail API**
- **Vercel AI SDK**
- **Anthropic Claude**
- **Docker**
- **Ofelia** for scheduled execution

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/carduuui/gmail_sort_ai_agent.git
cd gmail-sort-agent
```

### 2. Install dependencies

```bash
bun install
```

### 3. Environment variables

Create a `.env` file:

```env
ANTHROPIC_API_KEY=your_api_key
```

You also need `credentials.json` and `token.json` for Google authentication.

### 4. Run the agent

```bash
bun run script/sort-emails.ts
```

The agent connects to Gmail, analyzes emails using AI, and automatically assigns the appropriate labels.

## 🐳 Docker

Build the Docker image:

```bash
docker build -t gmail-sort-agent .
```

The container can then be executed automatically using **Ofelia** according to a configured schedule.

## 🔐 Security

The following files contain sensitive information and must **not** be committed to the repository:

```text
.env
credentials.json
token.json
```

These files are mounted into the Docker container externally.
