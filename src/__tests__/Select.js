import React from 'react';
import { expect as chaiExpect } from 'chai';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { WRAPPER_CLASS_IDENTITIFIER, MSG_CLASS_IDENTITIFIER } from '../js/Inputs/const.ts';
import mockConsole from 'jest-mock-console';
import Select, { isValidValue, getIndex } from '../js/Inputs/Select.tsx';
configure({ adapter: new Adapter() });

// const INPUT = 'input';
const WRAPPER = `.${WRAPPER_CLASS_IDENTITIFIER}`;
// const CONTAINER = `.${CONTAINER_CLASS_IDENTITIFIER}`;

const OPTION_LIST = [{ id: '', name: 'Please select one country' }, { id: 'us', name: 'US' }, { id: 'ca', name: 'CA' }, { id: 'uk', name: 'UK' }, { id: 'fr', name: 'France' }];

// const simulateKeypress = (element, code) => {
//   // let code = key.charCodeAt(0);
//   const event = new KeyboardEvent('keydown', { key: code });
//   element.dispatchEvent(event);
// };

describe('Select component', () => {
  it('[Toggling "validate"]: Should show msgHtml(err) when toggling "validate"', () => {
    const wrapper = mount(<Select optionList={OPTION_LIST} onBlur={() => {}} validate={false} />);
    wrapper.setProps({ validate: true });
    expect(wrapper.update().find(`.${MSG_CLASS_IDENTITIFIER}`).length).toEqual(1);
  });
  // TODO
  // it('[Providing tabIndex]: Should tabIndex be exact the same with given prop', () => {
  //   const wrapper = mount(<Select tabIndex={10} onBlur={() => {}} />);
  //   const $input = wrapper.find(INPUT);
  //   $input.simulate('focus');
  //   $input.simulate('blur');
  //   console.log($input.props())
  //   console.log(wrapper.find(INPUT).props())
  //   expect(wrapper.find(INPUT).props()['tabindex']).toEqual(1);
  // });

  it('[Providing msgOnError]: Should msg be msgOnError', () => {
    const msgOnError = 'msgOnError';
    const wrapper = mount(<Select optionList={OPTION_LIST} onBlur={() => {}} validationOption={{ msgOnError }} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    $wrapper.simulate('blur');
    expect(wrapper.find(`.${MSG_CLASS_IDENTITIFIER}`).text()).toEqual(msgOnError);
  });

  it('[successMsg]: Should show successMsg when msgOnSuccess is provided', () => {
    const msgOnSuccess = 'msgOnSuccess';
    const wrapper = mount(
      <Select
        optionList={OPTION_LIST}
        value={OPTION_LIST[2].id}
        onBlur={() => {}}
        onChange={() => {}}
        validationOption={{
          name: 'foobar',
          check: true,
          required: true,
          showMsg: true,
          msgOnSuccess,
        }}
      />,
    );
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    $wrapper.simulate('blur');
    expect(wrapper.find(`.${MSG_CLASS_IDENTITIFIER}`).text()).toEqual(msgOnSuccess);
  });

  it('[selectOptionListItemHtml]: Should render selectOptionListItemHtml', () => {
    const selectOptionListItemHtml = OPTION_LIST.map((i, k) => {
      return (
        <div className="foo" key={k}>
          {i.name}
        </div>
      );
    });
    const wrapper = mount(<Select optionList={OPTION_LIST} onChange={() => {}} selectOptionListItemHtml={selectOptionListItemHtml} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    expect(wrapper.find('.foo').length).toEqual(OPTION_LIST.length);
  });

  it('[Change props value]: Should check immediately when new props value is not equal to internal value', () => {
    const wrapper = mount(<Select optionList={OPTION_LIST} value={OPTION_LIST[2].id} onBlur={() => {}} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    $wrapper.simulate('blur');
    wrapper.setProps({ value: '' });
    expect(wrapper.update().find(`.${MSG_CLASS_IDENTITIFIER}`).length).toEqual(1);
  });

  it('[disabled]: Should msgHtml not be appeared when disabled', () => {
    const wrapper = mount(<Select optionList={OPTION_LIST} onBlur={() => {}} disabled={true} />);
    wrapper
      .find(`#react-inputs-validation__select_option-${OPTION_LIST[1].id}`)
      .hostNodes()
      .simulate('click');
    expect(wrapper.find(`.${MSG_CLASS_IDENTITIFIER}`).length).toEqual(0);
  });

  it('[isValidValue]: Should retrun true', () => {
    chaiExpect(isValidValue(OPTION_LIST, '')).equal(true);
  });

  it('[isValidValue]: Should retrun false', () => {
    chaiExpect(isValidValue(OPTION_LIST, 'foo')).equal(false);
  });

  it('[getIndex]: Should retrun 2', () => {
    chaiExpect(getIndex(OPTION_LIST, 'ca')).equal(2);
  });

  it('[getIndex]: Should retrun -1', () => {
    chaiExpect(getIndex(OPTION_LIST, 'foo')).equal(-1);
  });

  it("[onClick]: Should call parent's onClick", () => {
    let value = '';
    const wrapper = mount(
      <Select
        onClick={() => {
          value = 'clicked';
        }}
      />,
    );
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    expect(value).toEqual('clicked');
  });

  it("[onFocus]: Should call parent's onFocus", () => {
    let value = '';
    const wrapper = mount(
      <Select
        onFocus={() => {
          value = 'focused';
        }}
      />,
    );
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('focus');
    expect(value).toEqual('focused');
  });

  it('[validationOption.check]: Should msgHtml not be appeared when check is false', () => {
    const wrapper = mount(<Select onBlur={() => {}} validationOption={{ check: false }} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('focus');
    $wrapper.simulate('blur');
    expect(wrapper.find(`.${MSG_CLASS_IDENTITIFIER}`).length).toEqual(0);
  });

  // TODO: Because of https://github.com/airbnb/enzyme/issues/441
  // it('[ArrowDown]: Should called scroll', () => {
  //   let value = '';
  //   const wrapper = mount(
  //     <Select
  //       optionList={OPTION_LIST}
  //       onBlur={() => {}}
  //       onChange={res => {
  //         value = res;
  //       }}
  //     />,
  //   );
  //   const $wrapper = wrapper.find(WRAPPER);
  //   $wrapper.simulate('click');
  //   // simulateKeypress($wrapper.instance(), 40);
  //   // $wrapper.simulate('keydown', { key: 40 });
  //   // $wrapper.simulate('keypress', { key: 40 });
  //   // $wrapper.simulate('keypress', { key: 13 });
  //   expect(value).toEqual(OPTION_LIST[2].id);
  // });

  // TODO: Because of https://github.com/airbnb/enzyme/issues/441
  // it('[pageClick]: Should call onBlur', () => {
  //   const validationOption = { check: false };
  //   const wrapper = mount(
  //     <div id="outer">
  //       <div id="clicker">clicker</div>
  //       <Select optionList={OPTION_LIST} onChange={() => {}} validationOption={validationOption} />
  //     </div>,
  //   );
  //   const $wrapper = wrapper.find(WRAPPER);
  //   console.log(wrapper.update().find(CONTAINER).instance().className)
  //   $wrapper.simulate('click');
  //   // const map = {};
  //   // window.addEventListener = jest.genMockFn().mockImpl((event, cb) => {
  //   //   map[event] = cb;
  //   // });
  //   // map.mousemove({ pageX: 100, pageY: 100});
  //   console.log(wrapper.update().find(CONTAINER).instance().className)
  //   // expect(wrapper.update().find(WRAPPER).className).toEqual(1);
  // });

  it('[onClick]: Should choose item', () => {
    let value = '';
    const wrapper = mount(
      <Select
        value={value}
        optionList={OPTION_LIST}
        onChange={res => {
          value = res;
        }}
      />,
    );
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    const $el = wrapper.find(`#react-inputs-validation__select_option-${OPTION_LIST[2].id}`).hostNodes();
    $el.simulate('click');
    expect(value).toEqual(OPTION_LIST[2].id);
  });

  it('[onMouseOver]: Should option item add active class', () => {
    const value = '';
    const wrapper = mount(<Select value={value} optionList={OPTION_LIST} onChange={() => {}} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    const $el = wrapper.find(`#react-inputs-validation__select_option-${OPTION_LIST[2].id}`).hostNodes();
    $el.simulate('mouseover');
    expect($el.instance().className).toEqual('select__options-item-show-cursor  select__options-item false false false select__hover-active');
  });

  it('[onMouseMove]: Should option item remove active class', () => {
    const value = '';
    const wrapper = mount(<Select value={value} optionList={OPTION_LIST} onChange={() => {}} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    const $el = wrapper.find(`#react-inputs-validation__select_option-${OPTION_LIST[2].id}`).hostNodes();
    $el.simulate('mouseover');
    $el.simulate('mousemove');
    expect($el.instance().className).toEqual('select__options-item-show-cursor  select__options-item false false false select__hover-active');
  });

  it('[onMouseMove]: Should option item remove active class', () => {
    const value = '';
    const wrapper = mount(<Select value={value} optionList={OPTION_LIST} onChange={() => {}} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    const $el = wrapper.find(`#react-inputs-validation__select_option-${OPTION_LIST[2].id}`).hostNodes();
    $el.simulate('mouseover');
    $el.simulate('mouseout');
    expect($el.instance().className).toEqual('select__options-item-show-cursor  select__options-item false false false ');
  });

  it('[console.error REACT_INPUTS_VALIDATION_CUSTOM_ERROR_MESSAGE_EXAMPLE]: Should console.error REACT_INPUTS_VALIDATION_CUSTOM_ERROR_MESSAGE_EXAMPLE', () => {
    const restoreConsole = mockConsole();
    const wrapper = mount(<Select optionList={OPTION_LIST} onBlur={() => {}} validationOption={{ locale: 'foobar' }} />);
    const $wrapper = wrapper.find(WRAPPER);
    $wrapper.simulate('click');
    $wrapper.simulate('blur');
    expect(console.error).toHaveBeenCalled();
    restoreConsole();
  });
});
