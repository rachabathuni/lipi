all: clean
	mkdir -p build
	mkdir -p build/images
	cp images/favicon.png build/images/
	cp *.html build/
	cp *.js build/
	cp *.css build/

clean:
	rm -rf build


