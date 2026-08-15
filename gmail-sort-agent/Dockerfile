FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile
RUN bun pm ls

COPY . .

CMD ["bun", "run", "script/sort-emails.ts"]