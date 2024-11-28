import { useState, useCallback } from 'react';
import { validateRequired, validateEmail, validateNumber, validateDate } from '../utils/validations';

export default function useForm(initialState, validationRules = {}) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((name, value) => {
    if (!validationRules[name]) return true;

    const rules = validationRules[name];
    let isValid = true;
    let error = '';

    if (rules.required && !validateRequired(value)) {
      isValid = false;
      error = 'Este campo é obrigatório';
    } else if (rules.email && !validateEmail(value)) {
      isValid = false;
      error = 'Email inválido';
    } else if (rules.number && !validateNumber(value)) {
      isValid = false;
      error = 'Valor numérico inválido';
    } else if (rules.date && !validateDate(value)) {
      isValid = false;
      error = 'Data inválida';
    }

    return { isValid, error };
  }, [validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const validation = validate(name, value);

    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({
      ...prev,
      [name]: !validation.isValid ? validation.error : ''
    }));
  }, [validate]);

  const handleSubmit = useCallback(async (submitFunction) => {
    setIsSubmitting(true);
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const validation = validate(key, values[key]);
      if (!validation.isValid) {
        newErrors[key] = validation.error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      try {
        await submitFunction(values);
      } catch (error) {
        console.error('Erro no envio:', error);
      }
    }
    setIsSubmitting(false);
    return isValid;
  }, [values, validationRules, validate]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
}