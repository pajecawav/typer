# Typer

## Запуск

### Локальный запуск

0. Склонируйте репозиторий `git clone https://github.com/pajecawav/typer`

1. Перейдите в директорию `cd typer`

2. Установите зависимости `yarn install`

3. Запустите сервер командой `yarn run start`. Сервер будет доступен по адресу `http://localhost:3000`.

### Запуск в Docker контейнере

0. Склонируйте репозиторий `git clone https://github.com/pajecawav/typer`

1. Перейдите в директорию `cd typer`

2. Создайте образ `typer` с помощью команды `docker build -t typer .`

3. Запустите Docker контейнер командой `docker run --rm -p 3000:80 typer`. Сервер будет доступен по адресу `http://localhost:3000`.
