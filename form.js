const formUtil = class {

    FieldTypes = {
        STRING: "string",
        NUMBER: "number",
        BOOL: "bool",
        DATE: "date",
    }

    constructor() {
        this.fieldRules = {}
        this.formFields = {}
        this.fieldErrors = {}
    }
    
    getDefaultValue = (type) => {
        let value = undefined
        if (type === this.FieldTypes.BOOL) value = false;

        return value
    }

    //#region metodos para validar los valores
    
    validateRequired = ({ type, field, fieldValue, ruleConfig }) => {
        let hasError = false
        if (type === this.FieldTypes.STRING || type === this.FieldTypes.DATE) {
            if (!fieldValue) hasError = true
        } else if (fieldValue === undefined) {
            hasError = true
        }

        if (hasError) {
            const { message } = ruleConfig
            return message || `Campo ${field} es requerido`
        }

        else undefined
    }

    validateMin = ({ type, fieldValue, ruleConfig }) => {
        if (type === this.FieldTypes.NUMBER) {
            const { message, value } = ruleConfig
            if (!!fieldValue && (fieldValue < value)) {
                return message || `El valor no puede ser menor a ${value}`
            }
        }

        return undefined
    }

    validateMax = ({ type, fieldValue, ruleConfig }) => {
        if (type === this.FieldTypes.NUMBER) {
            const { message, value } = ruleConfig
            if (!!fieldValue && (fieldValue > value)) {
                return message || `El valor no puede ser mayor a ${value}`
            }
        }

        return undefined
    }

    validateTest = ({ type, value, ruleConfig }) => {
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

    rulesFunc = {
        required: this.validateRequired.bind(),
        min: this.validateMin.bind(),
        max: this.validateMax.bind(),
        test: this.validateTest.bind(),
    }

    createForm = (props) => {
        const { fields } = props
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
                [field]: undefined, 
            }

            this.fieldErrors = {
                ...this.fieldErrors,
                [field]: '', 
            }

            this.setValue(field, initialValue || this.getDefaultValue(`${type}`))
        }
    }

    getFormFields = () => {
        return this.formFields ?? {}
    }

    getFormErrors = () => {
        return this.fieldErrors ?? {}
    }

    setValue = (key, value) => {
        let fields = this.formFields
        for(let field in fields) {
            if (field === key) {
                const fieldComponent = document.getElementById(field)
                fields[field] = value
                fieldComponent.setAttribute('value', value  ?? '')
            }
        }
    }

    setValues = (fields) => {
        let internalFields = this.formFields
        for(let field in internalFields) {
            this.setValue(field, fields[field])
        }
    }

    

    validateField = (key) => {
        const fields = this.formFields
        const rules = this.fieldRules[key] ?? {}
        const value = fields[key]
        if (rules) {
            const { type, ...otherRules } = rules
            this.fieldErrors[key] = ''
            const validateParams = {
                type,
                field: key,
                fieldValue: value,
            }

            for(let rule in otherRules) {
                if (!otherRules[rule]) continue
                validateParams.ruleConfig = otherRules[rule]
                const error = this.rulesFunc[rule](validateParams)
                if (error) {
                    this.fieldErrors[key] = error
                    break
                }
            }
        }
    }

    validateForm = () => {
        const fields = this.formFields
        for (let field in fields) {
            this.validateField(field)
        }

        const formErrors = this.getFormErrors()
        const errorTags = document.getElementsByClassName('formErrorMessage')
        for (let error in formErrors) {
            const errorTag = errorTags[error]
            errorTag.innerHTML = ''
            if (formErrors[error] && errorTag) {
                errorTag.innerHTML = formErrors[error]
            }
        }
    }
}

const initFormInstance = () => new formUtil()