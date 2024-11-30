
# PrestaShopProject

## Contents

- [Description](#description)
- [Software](#software)
- [How to run locally](#how-to-run-locally)
- [How to test the project](#how-to-test-the-project)
- [Admin panel](#admin-panel)
- [How to contribute](#how-to-contribute)
- [Authors](#authors)

## Description
The project was made to copy the look and functionality of the [GNOM website](https://gnom-sklep.pl/), using the [Prestashop](https://pl.prestashop.com/) e-commerce software that is run on Docker container for ease-of-use and portability.

> [!NOTE]
> Project was created for educational purposes only.

## Software
Software used in the project:
- PrestaShop 1.7.8
- MySQL
- Docker
- Python
- Selenium Python library

## How to run locally

1. Clone the repository:
```bash
git clone https://github.com/arekflis/PrestaShopProject.git
cd PrestaShopProject
```

2. Create and start a Docker container:
```bash
docker-compose up --build
```

3. Open a web browser at https://localhost:8443 to start using the project.

4. If the page doesn't load use the following command to grant the neccessary permissions:
```bash
docker exec -it <container_name> bash -c "chmod -R 777 ."
```

## How to test the project
To test the project with Selenium:
```bash
cd test
pip install selenium
python tests.py
```

## Admin panel

PrestaShop back office is available at the address https://localhost:8443/admin-panel \
Shop admin credentials:

|       Email        |       Password       |
|:------------------:|:--------------------:|
| admin@presta.com   | haslo1234            |

Shop database credentials:

|       User         |       Password       |
|:------------------:|:--------------------:|
| root               | admin                |


## How to contribute
After making changes in the PrestaShop database you can use the `dumpdb.sh` to create an SQL database dump at `docker/db_init'.

To run the script
```bash
cd docker/scripts
. dumpdb.sh
```

## Authors
- Arkadiusz Flisikowski
- Adrian Zdankowski


