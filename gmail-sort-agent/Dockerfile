FROM oven/bun:1

WORKDIR /app

# Nur package.json zuerst kopieren, für Docker-Layer-Caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Restlichen Code kopieren
COPY . .

CMD ["bun", "run", "sort-emails.ts"]