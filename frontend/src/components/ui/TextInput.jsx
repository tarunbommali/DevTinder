const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  autoComplete = "off",
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
);

export default Input;