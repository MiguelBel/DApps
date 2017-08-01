docker-compose run contracts node deploy.js
curl -F "image=@./a_post.json" http://localhost:5001/api/v0/add
curl -F "image=@./another_post.json" http://localhost:5001/api/v0/add
docker-compose run contracts node publish.js http://testrpc:8545 0xdb9991ba60a929e8817aa511fe5fb6703bc34797 QmdPS5nWUD6PGcMw99aJwsFFumKumKPi3jY61zEq6i1Zf7
docker-compose run contracts node publish.js http://testrpc:8545 0xdb9991ba60a929e8817aa511fe5fb6703bc34797 Qmb2EoiYy7fogt6SojLBkZsCbVncZ8NLjy6hCyhA6wqpWv