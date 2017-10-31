TESTS?=$$(go list ./... | egrep -v "vendor")
DOCKER_IMAGE_VERSION?=build
PG_NAME?=local-postgis
PG_PORT?=5433

test/create:
	curl -H "Content-Type: application/json" -X POST -d @test.json localhost:8000/pdv 2> /dev/null | jq

test/get:
	curl -X GET localhost:8000/pdv/16 2> /dev/null | jq

test/find:
	curl -X GET localhost:8000/pdvs/-43.297337/-23.013538 2> /dev/null | jq

postgres/up:
	docker run --name $(PG_NAME) -v ${PWD}/sql:/docker-entrypoint-initdb.d/ -p $(PG_PORT):5432 -d mdillon/postgis

postgres/down:
	docker rm -f $(PG_NAME)

postgres/connect:
	docker run -it --rm postgres psql -U postgres -h 127.0.0.1 -p $(PG_PORT)

dependencies:
	npm install

test:
	$(MAKE) postgres/up PG_NAME=test-local PG_PORT=5555
	sleep 5
	PG_CONNECTION="user=postgres host=localhost dbname=postgres port=5555 sslmode=disable" go test -v $(TESTS)
	$(MAKE) postgres/down PG_NAME=test-local	