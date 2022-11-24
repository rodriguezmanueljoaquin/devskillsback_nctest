# NewCombin challenge - DevSkillsBack
## Autor

- [Rodríguez, Manuel Joaquín](https://github.com/rodriguezmanueljoaquin)

## Indice
- [Indice](#indice)
- [Compilación](#compilación)
- [Ejecución](#ejecución)
- [Ejemplos](#ejemplos)

## Compilación
Dentro de la carpeta del proyecto, se debe ejecutar:
```bash
$ npm install
```

## Ejecución
Para el correcto funcionamiento de la aplicación, debe encontrarse una base de datos de PostgreSQL ejecutandose en el puerto 5432, y las credenciales para acceder a ella deben ser indicadas en el archivo que se encuentra en `./src/databases/credentials.json`.

Dentro de la carpeta del proyecto, se debe ejecutar:
```bash
$ npm start
```

La API se ejecutara en localhost bajo el puerto 5000 por default, esto puede ser modificado seteando la variable SERVER_PORT en el entorno con:
+ $env:SERVER_PORT=5000 (Windows)
+ export SERVER_PORT=5000 (Linux/Mac)

## Ejemplos
### Creación de boleta de pago
Se debe realizar un `POST` al endpoint `localhost:5000/transactions` con un body que siga los siguientes lineamientos:
```json
{
    "type": "Luz", // puede ser Luz o Gas
    "description": "Edenor Z.A.", //TEXT
    "due_date": "2021-01-16", // formato YYYY-MM-DD
    "amount": 115, // INTEGER
    "status": "pending", // puede ser pending o paid
    "bar_code": "112344" // TEXT
}
```

### Pago de una boleta de pago existente
Se debe realizar un `PUT` al endpoint `localhost:5000/transactions` con un body que siga los siguientes lineamientos:
```json
{
    "payment_method": "credit_card", // puede ser dedit_card, credit_card o cash
    "card_number": "123123", // solo requerido cuando el pago no es en efectivo
    "pay_date": "2021-01-16", // formato YYYY-MM-DD
    "amount": 115, // INTEGER, debe ser equivalente al monto establecido en la boleta del sistema
    "bar_code": "112344" // TEXT
}
```

### Obtener boletas de pago
Se debe realizar un `GET` al endpoint `localhost:5000/transactions`.
En caso de querer realizar filtrado, se pueden usar los siguientes queryParams:

+ status: Puede ser "pending" o "paid" para obtener los que estan pendientes de pago y los ya pagados respectivamente.
+ type: Puede ser "Luz" o "Gas" para obtener aquellos pagos solo de este tipo de servicios.

Ejemplo: `localhost:5000/transactions?status=paid&type=Luz`

### Obtener monto de boletas de pago pagadas acumuladas por día en un rango de fechas
Se debe realizar un `GET` al endpoint `localhost:5000/transactions`.
Se deben utilizar los siquientes queryParams:

+ start_date: Día de inicio en el rango.
+ end_date: Día de fin en el rango.

Ejemplo: `localhost:5000/transactions/accumulated?start_date=2021-01-10&end_date=2021-01-25`
