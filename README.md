# Elysia with Bun runtime

normal mode: bun dev

load balancer pm2 & nginx

pm2 start src/index.ts --interpreter bun --name api-1 -- --port=3001
pm2 start src/index.ts --interpreter bun --name api-2 -- --port=3002
pm2 start src/index.ts --interpreter bun --name api-3 -- --port=3003
pm2 start src/index.ts --interpreter bun --name api-4 -- --port=3004
