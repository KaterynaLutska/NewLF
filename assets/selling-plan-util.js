const watchElement = (el, observeProps, callback) => {
  const observer = new MutationObserver(callback)
  return observer.observe(el, observeProps);
};

export const observeInputValueChange = function(inputElement, callback) {
  watchElement(inputElement, {
    attributes: true,
    childList: false,
    subtree: false
  }, (mutationsList) => {
    const valueChanged = mutationsList.find(mutation => mutation.type === 'attributes' && mutation.attributeName === 'value');
    if (valueChanged)
    callback(valueChanged.target.value);
  });
  
  inputElement.addEventListener('change', (e) => callback(e.target.value));
};