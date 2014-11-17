build:
	@browserify evenlevel.js > dist/evenlevel.js
	@uglifyjs dist/evenlevel.js  > dist/evenlevel.min.js

doc:
	@inkdoc

serve:
	@python -m SimpleHTTPServer 5555 &

dependencies:
	sudo npm install -g browserify
	sudo npm install -g inkdoc
