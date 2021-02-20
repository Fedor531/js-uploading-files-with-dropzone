function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function upload(selector, options = {}) {
    // Переменная для записи файлов
    let files = []
  const input = document.querySelector(selector);

  const openButton = document.createElement('button');
  openButton.classList.add('btn');
  openButton.textContent = 'Открыть';

  const preview = document.createElement('div');
  preview.classList.add('preview');

  input.insertAdjacentElement('afterend', openButton);
  input.insertAdjacentElement('afterend', preview);

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join());
  }

  const triggerInput = () => {
    input.click();
  };

  const changeHandler = (event) => {
    if (!event.target.files.length) {
      return;
    }

    files = Array.from(event.target.files);

    preview.innerHTML = '';

    files.forEach((file) => {
      if (!file.type.match('image')) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        // Закодированный результат
        preview.insertAdjacentHTML(
          'afterbegin',
          `
            <div class="preview-image">
                <div data-name="${file.name}" class="preview-remove">&times;</div>
                <img src="${event.target.result}" alt="${file.name}"  />
                <div class="preview-info">
                    <span>${file.name}</span>
                    <span>${bytesToSize(file.size)}</span>
                </div>
            </div>
        `
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const removeHandler = event => {
      if(!event.target.dataset.name) {
          return
      }
      const {name} = event.target.dataset
      files = files.filter(file => file.name !== name)
      console.log(files);
      // Находим нужный элемент с помощью атрибута data-name и помощью closest находи ближайший блок в котором находится крестик
      const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')
      block.classList.add('removing')
      setTimeout(() => {block.remove()},300)
      console.log(block);
  }

  // Собыите открытия окна загрузки
  openButton.addEventListener('click', triggerInput);

  // Событие для input, когда какие-лиюо файлы загружены
  input.addEventListener('change', changeHandler);
  preview.addEventListener('click', removeHandler)
}
