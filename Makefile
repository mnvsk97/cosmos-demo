.PHONY: dev prod-sync prod-run prod-restart

ENV?=staging

dev:
	DEBUG=yolo:* npm start

prod-sync:
	rsync ubuntu@cosmos-stage.uolo.co:/opt/cosmos/.env server.env
	rsync --delete --archive --verbose --compress --exclude "node_modules" --exclude ".git" . ubuntu@cosmos-stage.uolo.co:/opt/cosmos
	rsync server.env ubuntu@cosmos-stage.uolo.co:/opt/cosmos/.env

prod-run:
	pm2 start server.js --name cosmos-${ENV}

prod-restart:
	pm2 restart server.js --name cosmos-${ENV}
