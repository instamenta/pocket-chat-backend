SHELL := /bin/bash

.PHONY: create_cache create_database create_pgadmin

all: create_cache create_database create_pgadmin

create_cache:
	docker run -d \
	  --name pocket-redis \
	  -p 6379:6379 \
  	  redis:latest

create_database:
	 docker run -d \
       --name pocket-postgres \
       -e POSTGRES_USER=username \
       -e POSTGRES_PASSWORD=password \
       -e POSTGRES_DB=pocket \
       -p 5432:5432 \
       postgres:latest

create_pgadmin:
	docker run -d \
      --name pgadmin \
      -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
      -e PGADMIN_DEFAULT_PASSWORD=admin \
      -p 9999:80 \
      --link pocket-postgres:postgres \
      -d dpage/pgadmin4