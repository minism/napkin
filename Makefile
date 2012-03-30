BOOTSTRAP_DEV = static/lib/bootstrap-dev
BOOTSTRAP = static/lib/bootstrap

all:
	cd ${BOOTSTRAP_DEV} && make
	rm -rf ${BOOTSTRAP}
	mv ${BOOTSTRAP_DEV}/bootstrap ${BOOTSTRAP}

clean:
	rm -rf ${BOOTSTRAP}
