![Nakama](.github/logo.png?raw=true "Nakama logo")
======

[Original Readme](https://github.com/heroiclabs/nakama)

## Running locally

* **Docker Compose** - You will need to install Docker/Docker Compose for your OS (if on Windows you need to switch to Linux guests). The local docker-compose.yml is already configured to run the forked version's container [yncog/nakama](https://hub.docker.com/r/yncog/nakama). To build it locally follow the **Build** instructions bellow.
* **Container version** - Create an .env file in the same folder as docker-compose.yml with a single line (or define an env var for your terminal session):

    NAKAMA_TAG=2.11.1

* **Custom scripts** - Put any scripts in the ***data/modules*** folder, before starting (or restart nakama's container after)

* **Run it** - In a terminal inside the same folder run (may need sudo):
    
    docker-compose up -d

* **Restart nakama** - Run:

    docker-compose stop nakama && docker-compose up -d

## Building Nakama

* **Console JS** - in a terminal inside the console/ui folder run 
    
    yarn run build

* **Package JS inside Go binary** - in a terminal inside the console folder run (depends on [Packr](https://github.com/gobuffalo/packr))

    packr

* **Go code** - run the hooks/build script (may need sudo)
