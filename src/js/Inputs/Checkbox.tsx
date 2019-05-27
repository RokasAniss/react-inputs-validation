import * as React from 'react';
const { useState, useEffect, useCallback, useRef, memo } = React;
import message from './message';
import { REACT_INPUTS_VALIDATION_CUSTOM_ERROR_MESSAGE_EXAMPLE, DEFAULT_LOCALE } from './const';
import reactInputsValidationCss from './react-inputs-validation.css';
const TYPE = 'checkbox';
interface DefaultValidationOption {
  name?: string;
  check?: boolean;
  showMsg?: boolean;
  required?: boolean;
  locale?: string;
  msgOnError?: string;
  msgOnSuccess?: string;
}

const getDefaultValidationOption = (obj: DefaultValidationOption) => {
  let { name, check, required, showMsg, locale, msgOnError, msgOnSuccess } = obj;
  locale = typeof locale !== 'undefined' ? locale : DEFAULT_LOCALE;
  name = typeof name !== 'undefined' ? name : '';
  check = typeof check !== 'undefined' ? check : true;
  showMsg = typeof showMsg !== 'undefined' ? showMsg : true;
  required = typeof required !== 'undefined' ? required : true;
  msgOnSuccess = typeof msgOnSuccess !== 'undefined' ? msgOnSuccess : '';
  msgOnError = typeof msgOnError !== 'undefined' ? msgOnError : '';
  return {
    name,
    check,
    showMsg,
    required,
    locale,
    msgOnError,
    msgOnSuccess,
  };
};

interface Props {
  tabIndex?: string | number | null;
  id?: string;
  name?: string;
  value?: string | boolean;
  checked?: boolean;
  disabled?: boolean;
  labelHtml?: React.ReactNode;
  validate?: boolean;
  onChange: (res: boolean, e: React.ChangeEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  validationOption?: object;
  classNameInput?: string;
  classNameWrapper?: string;
  classNameInputBox?: string;
  classNameContainer?: string;
  customStyleInput?: object;
  customStyleWrapper?: object;
  customStyleContainer?: object;
  customStyleInputBox?: object;
  validationCallback?: (res: boolean) => void;
}

const component: React.FC<Props> = ({
  tabIndex = null,
  id = '',
  name = '',
  value = '',
  checked = false,
  disabled = false,
  validate = false,
  labelHtml = null,
  classNameInput = '',
  classNameWrapper = '',
  classNameInputBox = '',
  classNameContainer = '',
  customStyleInput = {},
  customStyleWrapper = {},
  customStyleInputBox = {},
  customStyleContainer = {},
  validationOption = {},
  onChange = () => {},
  onBlur = undefined,
  onFocus = undefined,
  onClick = undefined,
  validationCallback = undefined,
}) => {
  const [err, setErr] = useState(false);
  const [msg, setMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const option = getDefaultValidationOption(validationOption);
  const $input = useRef(null);
  const $el: { [key: string]: any } | null = $input;
  const handleOnBlur = useCallback(
    e => {
      if (onBlur) {
        check();
        onBlur(e);
      }
    },
    [checked],
  );
  const handleOnFocus = useCallback(
    e => {
      if (onFocus) {
        onFocus(e);
      }
    },
    [checked],
  );
  const handleOnClick = useCallback(
    e => {
      handleOnChange(e);
      if (onClick) {
        onClick(e);
      }
    },
    [err, checked],
  );
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      if (disabled || $el === null) {
        return;
      }
      onChange && onChange(!checked, e);
      if (err) {
        setErr(false);
      } else {
        setSuccessMsg('');
      }
    },
    [err, checked],
  );
  const check = useCallback(
    (val: null | string = null) => {
      const { name, check, locale, required, msgOnSuccess } = option;
      if (!check) {
        return;
      }
      if (!message[locale] || !message[locale][TYPE]) {
        console.error(REACT_INPUTS_VALIDATION_CUSTOM_ERROR_MESSAGE_EXAMPLE);
        return;
      }
      if (required) {
        const msg = message[locale][TYPE];
        const nameText = name ? name : '';
        if (!checked) {
          handleCheckEnd(true, msg.unchecked(nameText));
          return;
        }
      }
      if (msgOnSuccess) {
        setSuccessMsg(msgOnSuccess);
      }
      handleCheckEnd(false, msgOnSuccess);
    },
    [checked],
  );
  const handleCheckEnd = useCallback((err: boolean, message: string) => {
    let msg = message;
    const { msgOnError } = option;
    if (err && msgOnError) {
      msg = msgOnError;
    }
    setErr(err);
    setMsg(msg);
    validationCallback && validationCallback(err);
  }, []);
  useEffect(() => {
    if ($el === null) {
      return;
    }
    if (tabIndex) {
      $el.current.setAttribute('tabindex', String(tabIndex));
    }
  }, []);
  useEffect(
    () => {
      if (validate) {
        check();
      }
    },
    [validate, checked],
  );
  const wrapperClass = `${classNameWrapper} ${reactInputsValidationCss[`${TYPE}__wrapper`]} ${checked && reactInputsValidationCss['checked']} ${err &&
    reactInputsValidationCss['error']} ${successMsg !== '' && !err && reactInputsValidationCss['success']} ${disabled && reactInputsValidationCss['disabled']}`;
  const containerClass = `${classNameContainer} ${reactInputsValidationCss[`${TYPE}__container`]} ${checked && reactInputsValidationCss['checked']} ${err &&
    reactInputsValidationCss['error']} ${successMsg !== '' && !err && reactInputsValidationCss['success']} ${disabled && reactInputsValidationCss['disabled']}`;
  const boxClass = `${classNameInputBox} ${reactInputsValidationCss[`${TYPE}__box`]} ${err && reactInputsValidationCss['error']} ${checked && reactInputsValidationCss['checked']} ${successMsg !==
    '' &&
    !err &&
    reactInputsValidationCss['success']} ${disabled && reactInputsValidationCss['disabled']}`;
  const labelClass = `${checked && reactInputsValidationCss['checked']} ${err && reactInputsValidationCss['error']} ${successMsg !== '' && !err && reactInputsValidationCss['success']} ${disabled &&
    reactInputsValidationCss['disabled']}`;
  const errMsgClass = `${reactInputsValidationCss['msg']} ${err && reactInputsValidationCss['error']}`;
  const successMsgClass = `${reactInputsValidationCss['msg']} ${!err && reactInputsValidationCss['success']}`;
  let msgHtml;
  const { showMsg } = option;
  if (showMsg && err && msg) {
    msgHtml = <div className={errMsgClass}>{msg}</div>;
  }
  if (showMsg && !err && successMsg !== '') {
    msgHtml = <div className={successMsgClass}>{successMsg}</div>;
  }
  return (
    <div ref={$input} className={wrapperClass} style={customStyleWrapper} onClick={handleOnClick} onBlur={handleOnBlur} onFocus={handleOnFocus}>
      <div className={containerClass} style={customStyleContainer}>
        <div className={boxClass} style={customStyleInputBox}>
          <div className={reactInputsValidationCss['box']} />
          <input id={id} name={name} type={TYPE} className={reactInputsValidationCss[`${TYPE}__input`]} value={String(value)} defaultChecked={checked} disabled={disabled} onChange={handleOnChange} />
        </div>
        <label className={labelClass}>{labelHtml}</label>
      </div>
      {msgHtml}
    </div>
  );
};
export default memo(component);
