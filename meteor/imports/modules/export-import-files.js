export const exportToLocalFile = (filename, text) => {
  const pom = document.createElement('a');
  pom.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  pom.setAttribute('download', filename);
  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
};

export const importFromLocalFile = (file, insertInDatabase) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e) => {
    const resultado = e.target.result;
    try {
      const archivoParseado = JSON.parse(resultado);
      insertInDatabase(archivoParseado);
    } catch (error) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
  };
};
