
# Basic-Form

libreria para el manejo de formularios en javaScript


# Como funciona

Para utilizar la libreria debemos importarla de la siguiente manera

`<script src="form.js" type="text/javascript"></script>`

Para crear una nueva instancia de un formulario utilizamos la funcion `initFormInstance()`

`
const form = initFormInstance()
`

Una vez creada la instancia procedemos a crear el formulario con los campos y
reglas a validar

```
form.createForm({
    key: 'test-1',
    fields: {
        name: {
            type: form.FieldTypes.STRING,
            required: {
                message: 'cualquier mensaje de error'
            },
        },
        age: {
            type: form.FieldTypes.NUMBER,
            min: {
                value: 10,
                message: 'cualquier mensaje de error'
            }
        }
    }
})
```

Para agregar valores a los campos definidos en el formalario ocupamos la
funcion `form.setValue(field, value)`

`field => nombre de los objetos definidos en fields al crear el formulario (name o age)`

Para agregar multiples valores utilizamos la funcion `form.setValues(fields)`

```
form.setValues({
    name: 'Jhon Doe',
    age: 10,
})
```

Para recuperar los valores del formulario se realiza con la funcion
`const error = form.getFormFields()`

Los valores del formulario se visualizan de la siguiente forma
`{name: 'Jhon Doe', age: '40'}`

Para realizar las validaciones podemos utilizar la
funcion `form.validateField(field)` esto para validar un unico field del formulario

Si quisieramos validar el formulario completo seria con la funcion
`const errors = form.validateForm()`

Si necesitamos obtener los errores del formulario lo hacemos mediante la funcion
`form.getFormErrors()`

Los errores se visualizaran de la siguiente forma
`{name: 'campo requerido', age: 'El valor no puede ser menor a 10'}`

## Tipos de campos permitidos

| name            |
| ----------------- |
| string |
| number |
| bool |
| date |

## reglas soportadas

| name            |
| ----------------- |
| required |
| max |
| min |
| test |

### propiedades de la regla required 

| name            | descripción            |
| ----------------- | ----------------- |
| message | mensaje a mostrar cuando la regla no se cumpla |

### propiedades de la regla min 

| name            | descripción            |
| ----------------- | ----------------- |
| value | valor minimo permitido |
| message | mensaje a mostrar cuando la regla no se cumpla |

### propiedades de la regla max 

| name            | descripción            |
| ----------------- | ----------------- |
| value | valor maximo permitido |
| message | mensaje a mostrar cuando la regla no se cumpla |

### propiedades de la regla test 

| name            | descripción            |
| ----------------- | ----------------- |
| regex | expresion regular para validar el valor del campo |
| message | mensaje a mostrar cuando la regla no se cumpla |





