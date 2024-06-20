
import './radio.css'

export default function MyRadio({ name, options, selectedValue, onChange }) {
    return (
        <form className="form2">
        {options.map(option => (
            <div key={option.id} className="form-check ps-0">
                <label htmlFor={option.id}>{option.label}</label>
                <input
                    id={option.id}
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={onChange}
                    className="form-check-input"
                />
            </div>
        ))}
    </form>
    )
}
