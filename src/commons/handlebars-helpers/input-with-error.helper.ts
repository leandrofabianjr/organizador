import { ValidationError } from 'class-validator';
import { JSDOM } from 'jsdom';

export const inputWithError = function (inputName: string, options) {
  const errors: ValidationError[] = options?.data?.root?.form?.errors ?? [];
  const error = errors.find((e) => e.property == inputName);
  const value = options?.data?.root?.form?.values?.[inputName];

  const document = new JSDOM(`<html>${options.fn()}</html>`).window.document;
  const $html = document.querySelector('html');

  const $input: HTMLInputElement = $html.querySelector(`[name=${inputName}]`);

  if (error) {
    $input.classList.add('is-invalid');
    const $feedback = document.createElement('div');
    $feedback.classList.add('invalid-feedback');
    const key = Object.keys(error.constraints)[0];
    $feedback.innerHTML = error.constraints[key];
    $html.appendChild($feedback);
  }

  if (value != undefined) {
    $input.setAttribute('value', value);
  }

  return $html.innerHTML;
};
