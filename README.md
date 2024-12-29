# KPI Test Platform

## Опис проєкту

KPI Test Platform - це веб-додаток, клієнтська частина якого розроблена на основі React. Проєкт
використовує npm для управління залежностями.

## Інструкція по запуску локально через Docker

### Передумови

1. Встановлений Docker.

### Кроки для запуску

1. **Клонування репозиторію:**

    ```sh
    git clone https://github.com/dima0808/kpi-ficting.git
    cd kpi-ficting
    ```

2. **Збірка та запуск контейнера:**

   Виконайте наступну команду для збірки та запуску контейнера:

    ```sh
    docker build -t frontend-app .
    docker run -p 3000:3000 frontend-app
    ```

3. **Доступ до додатку:**

   Після успішного запуску, додаток буде доступний за адресою `http://localhost:3000`.

## Серверна частина проєкту

Серверна частина проєкту розроблена на основі Java з використанням Spring Boot. Перейдіть
за [посиланням на репозиторій](https://github.com/dima0808/kpi-ficting-backend) для ознайомлення з
інструкцією по запуску.