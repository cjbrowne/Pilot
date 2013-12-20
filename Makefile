.PHONY: test
.PHONY: test-server
.PHONY: test-client


test: test-server test-client

test-server:
	cd node_modules/pilot-server && mocha --reporter spec

test-client:
	mocha --reporter spec