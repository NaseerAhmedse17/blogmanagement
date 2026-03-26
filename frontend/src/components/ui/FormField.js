import React, { memo } from 'react';

/**
 * FormField — label + input/textarea/select + error/hint in one reusable wrapper.
 *
 * Usage:
 *   <FormField label="Email" error={errors.email} hint="We'll never share it">
 *     <input ... />
 *   </FormField>
 */
const FormField = memo(({ label, htmlFor, error, hint, required, children, style }) => (
  <div className="form-group" style={style}>
    {label && (
      <label className="form-label" htmlFor={htmlFor}>
        {label}
        {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
      </label>
    )}
    {children}
    {error && <p className="form-error">⚠ {error}</p>}
    {!error && hint && <p className="form-hint">{hint}</p>}
  </div>
));

FormField.displayName = 'FormField';
export default FormField;
