(() => {
  const inputs = document.querySelectorAll('.code-digit');
  const hidden = document.getElementById('code-hidden');
  const form = document.getElementById('code-form');
  if (!inputs.length || !hidden || !form) return;

  function getCode() {
    return Array.from(inputs).map((i) => i.value).join('');
  }

  function trySubmit() {
    const code = getCode();
    if (/^[A-Z0-9]{6}$/.test(code)) {
      hidden.value = code;
      form.submit();
    }
  }

  inputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      const val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      input.value = val.slice(0, 1);
      if (val && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
      trySubmit();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        inputs[idx - 1].focus();
        inputs[idx - 1].value = '';
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData.getData('text') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      for (let i = 0; i < Math.min(text.length, inputs.length); i++) {
        inputs[i].value = text[i];
      }
      const focusIdx = Math.min(text.length, inputs.length - 1);
      inputs[focusIdx].focus();
      trySubmit();
    });
  });

  // Focus first input
  inputs[0].focus();
})();
