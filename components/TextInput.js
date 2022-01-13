import React from 'react';
import css from './TextInput.module.scss';

export class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: (props.locked && props.active) || false,
      value: props.value || '',
      error: props.error || '',
      label: props.label || 'Label',
    };

    this.onChange = props.onChange;
  }

  changeValue(event) {
    const value = event.target.value;
    this.setState({ value, error: '' });
    this.onChange(event.target.value);
  }

  handleKeyPress(event) {
    if (event.which === 13) {
      this.setState({ value: this.props.predicted });
    }
  }

  render() {
    const { active, value, error, label } = this.state;
    const { predicted, locked } = this.props;
    const fieldClassName = `${css.field} ${(locked ? active : active || value) && css.active}`;

    return (
      <div className={fieldClassName}>
        {active && value && predicted && predicted.includes(value) && <p className="predicted">{predicted}</p>}
        <input
          id={1}
          type="text"
          value={value}
          placeholder={label}
          onChange={this.changeValue.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          onFocus={() => !locked && this.setState({ active: true })}
          onBlur={() => !locked && this.setState({ active: false })}
        />
        <label htmlFor={1} className={error && css.error}>
          {error || label}
        </label>
      </div>
    );
  }
}
