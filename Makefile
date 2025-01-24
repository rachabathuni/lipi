all: clean
	mkdir -p build
	mkdir -p build/images
	mkdir -p build/scripts
	mkdir -p build/styles
	cp images/favicon.png build/images/
	cp *.html build/
	cp scripts/*.js build/scripts/
	cp styles/*.css build/styles/

clean:
	rm -rf build


