BOOTSTRAP_DEV = static/bootstrap-dev
BOOTSTRAP = static/bootstrap

all:
	cd ${BOOTSTRAP_DEV} && make
	rm -rf ${BOOTSTRAP}
	mv ${BOOTSTRAP_DEV}/bootstrap ${BOOTSTRAP}

clean:
	rm -rf ${BOOTSTRAP}
