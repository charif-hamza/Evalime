setup:
	npm install
	pip install -r API_serv/requirements.txt

lint:
	npm run lint

test:
	pytest -q

ci: lint test
