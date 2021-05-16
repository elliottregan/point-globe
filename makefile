all: run

container:
	docker build -t globe .

run: container
	docker run --rm -it \
	--name globe \
	-p 3000:3000 \
	-v `pwd`:/app \
	-v /app/node_modules \
	globe $(c)

develop:
	make run c="npm run dev"

develop-browser:
	make run c="npm run dev:browser"

build:
	make run c="npm run build"

build-browser:
	make run c="npm run build:browser"
