
const TextArea = ({ label, name, value, onChange, required = false }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-semibold mb-1">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border rounded"
    ></textarea>
  </div>
);

export default TextArea;

