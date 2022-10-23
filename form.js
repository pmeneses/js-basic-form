const formUtil = class {

    FieldTypes = {
        STRING: "string",
        NUMBER: "number",
        BOOL: "bool",
        DATE: "date",
    }

    constructor() {
        this.formKey = ''
        this.fieldRules = {}
        this.formFields = {}
        this.fieldErrors = {}
    }
    
    getDefaultValue = (type) => {
        let value = ''
        if (type === this.FieldTypes.NUMBER) value = 0;
        if (type === this.FieldTypes.BOOL) value = false;

        return value
    }

    //#region metodos para validar los valores
    
    validateRequired = (type, field, value, ruleConfig) => {
        let hasError = false
        if (type === this.FieldTypes.STRING || type === this.FieldTypes.DATE) {
            if (!value) hasError = true
        } else if (value === undefined) {
            hasError = true
        }

        if (hasError) {
            const { message } = ruleConfig
            return message || `Campo ${field} es requerido`
        }

        else undefined
    }

    validateMin = (type, fieldValue, ruleConfig) => {
        if (type === this.FieldTypes.NUMBER) {
            const { message, value } = ruleConfig
            if (fieldValue < value) {
                return message || `El valor no puede ser menor a ${value}`
            }
        }

        return undefined
    }

    validateMax = (type, fieldValue, ruleConfig) => {
        if (type === this.FieldTypes.NUMBER) {
            const { message, value } = ruleConfig
            if (fieldValue > value) {
                return message || `El valor no puede ser mayor a ${value}`
            }
        }

        return undefined
    }

    validateTest = (type, value, ruleConfig) => {
        if (type === this.FieldTypes.STRING) {
            const { message, regex } = ruleConfig
            if (regex) {
                const hasError = !regex.test(value)
                if (hasError) {
                    return message || 'texto invalido'
                }
            }
        }

        return undefined
    }

    //#endregion

    createForm = (props) => {
        const {key, fields} = props
        this.formKey = key
        for(let field in fields) {
            const {
                type,
                initialValue,
                required,
                max,
                min,
                test,
            } = fields[field]

            this.fieldRules = {
                ...this.fieldRules,
                [field]: {
                    type,
                    required,
                    max,
                    min,
                    test,
                }
            }

            this.formFields = {
                ...this.formFields,
                [field]: initialValue || this.getDefaultValue(`${type}`), 
            }

            this.fieldErrors = {
                ...this.fieldErrors,
                [field]: '', 
            }
        }
    }

    getFormFields = () => {
        return this.formFields ?? {}
    }

    getFormErrors = () => {
        return this.fieldErrors ?? {}
    }

    setValues = (fields) => {
        let internalFields = this.formFields
        for(let field in internalFields) {
            if (fields[field]) {
                internalFields[field] = fields[field]
            }
        }
    }

    setValue = (key, value) => {
        let fields = this.formFields
        for(let field in fields) {
            if (field === key) {
                fields[field] = value
            }
        }
    }

    validateField = (key) => {
        const fields = this.formFields
        const rules = this.fieldRules[key]
        const value = fields[key]
        if (rules) {
            const { type, ...otherRules } = rules
            this.fieldErrors[key] = ''
            if (otherRules.required) {
                const error = this.validateRequired(type, key, value, otherRules.required)
                if (error) {
                    this.fieldErrors[key] = error
                    return
                }
            }

            if (otherRules.min) {
                const error = this.validateMin(type, value, otherRules.min)
                if (error) {
                    this.fieldErrors[key] = error
                    return
                }
            }

            if (otherRules.max) {
                const error = this.validateMax(type, value, otherRules.max)
                if (error) {
                    this.fieldErrors[key] = error
                    return
                }
            }

            if (otherRules.test) {
                const error = this.validateTest(type, value, otherRules.test)
                if (error) {
                    this.fieldErrors[key] = error
                    return
                }
            }
        }
    }

    validateForm = () => {
        const fields = this.formFields
        for (let field in fields) {
            this.validateField(field)
        }

        return this.getFormErrors()
    }
}

const initFormInstance = () => new formUtil()