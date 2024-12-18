# sudo chown -R $(whoami) ~/.docker
app:
	docker compose rm -sf; \
	docker compose -f docker-compose.yml up --build --detach --pull "always"; \
	docker image prune -f

# chạy tất cả các services development
dev:
	docker compose rm -sf && \
	docker compose --profile "*" -f docker-compose-dev.yml up --build --detach && \
	docker image prune -f && \
	docker exec -it chat-fmecg iex -S mix phx.server

log:
	docker compose logs -f --tail=10

node:
	docker exec -it node-fmecg sh

db:
	docker exec -it database-fmecg sh

bin:
	docker exec -it bin-fmecg sh

# migrate: sau khi vào bash => gõ /app/bin/migrate
# migrate: sau khi vào bash => gõ /app/bin/server_chat remote
chatbash:
	docker exec -it chat-fmecg sh

chatdb:
	docker exec -it database-chat-fmecg sh


# chỉ run các services backend bao gồm db, node, chat (đồng thời run interactive shell của chat)
chatdev:
	docker compose rm -sf && \
	docker compose -f docker-compose-back-end.yml up --build --detach && \
	docker exec -it chat-fmecg iex -S mix phx.server

# another way to run iex -> cách này không thấy được api gọi => tách riêng phần show/db và iex	
# elixir --sname server_chat -S mix phx.server	
# make chatbash -> iex --sname console --remsh server_chat
