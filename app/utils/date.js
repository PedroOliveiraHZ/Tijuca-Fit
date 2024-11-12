const formatDateToYYYYMMDD = (date) => {
  // Ajusta a data para o fuso horário local
  const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// Exemplo de uso
const date = new Date();
const formattedDate = formatDateToYYYYMMDD(date);
console.log(formattedDate); // Saída no formato YYYY-MM-DD

module.exports = { formatDateToYYYYMMDD};
