function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Helper для создания dom элементов
const element = (tag, classes = [], content) => {
  const node = document.createElement(tag);
  if (classes.length) {
    node.classList.add(...classes);
  }
  if (content) {
    node.textContent = content;
  }
  return node;
};

function noop () {
}

export function upload(selector, options = {}) {
  // Переменная для записи файлов
  let files = [];
  const onUpload = options.onUpload ?? noop
  const input = document.querySelector(selector);
  const openButton = element('button', ['btn'], 'Открыть');
  const uploadButton = element('button', ['btn', 'primary'], 'Загрузить');
  const preview = element('div', ['preview']);

  uploadButton.style.display = 'none';

  input.insertAdjacentElement('afterend', openButton);
  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', uploadButton);

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

    uploadButton.style.display = 'inline';

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
                <div data-name="${
                  file.name
                }" class="preview-remove">&times;</div>
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

  const removeHandler = (event) => {
    if (!event.target.dataset.name) {
      return;
    }
    const { name } = event.target.dataset;
    files = files.filter((file) => file.name !== name);
    // Находим нужный элемент с помощью атрибута data-name и помощью closest находи ближайший блок в котором находится крестик
    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image');
    block.classList.add('removing');
    setTimeout(() => {
      block.remove();
    }, 300);
    if (!files.length) {
      uploadButton.style.display = 'none';
    }
  };

    function uploadHandler() {
        // Удалить крестики при загрузке
    preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
    onUpload(files)
  };

  // Собыите открытия окна загрузки
  openButton.addEventListener('click', triggerInput);

  // Событие для input, когда какие-лиюо файлы загружены
  input.addEventListener('change', changeHandler);
  preview.addEventListener('click', removeHandler);
  uploadButton.addEventListener('click', uploadHandler);
}
