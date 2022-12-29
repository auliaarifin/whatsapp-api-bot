const phoneNumberFormatter = function(number){
  // menghilangkan karakter selain angka
  let formateted = number.replace(/\D/g,'');

  // mengganti angka 0 di depan menjadi 62

  if (formateted.startsWith('0')) {
    formateted = '62' + formateted.substr(1);
  }

  if (!formateted.endsWith('@c.us')){
    formateted += '@c.us'
  }
  return formateted;
}

module.exports =   {
  phoneNumberFormatter
}