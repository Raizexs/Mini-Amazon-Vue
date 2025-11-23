const IMAGES = {
  'PayPal.svg.png': require('./img/PayPal.svg.png'),
  'apay.svg.png': require('./img/apay.svg.png'),
  'bancoEstado.svg.png': require('./img/bancoEstado.svg.png'),
  'gpay.svg.png': require('./img/gpay.svg.png'),
  'ml-logo.svg.png': require('./img/ml-logo.svg.png'),
  'placeholder.png': require('./img/placeholder.png'),
  'prod1001-1.png': require('./img/prod1001-1.png'),
  'prod1001-2.png': require('./img/prod1001-2.png'),
  'prod1002-1.png': require('./img/prod1002-1.png'),
  'prod1003-1.png': require('./img/prod1003-1.png'),
  'prod1004-1.png': require('./img/prod1004-1.png'),
  'prod1005-1.png': require('./img/prod1005-1.png'),
  'prod1006-1.png': require('./img/prod1006-1.png'),
  'prod1007-1.png': require('./img/prod1007-1.png'),
  'prod1008-1.png': require('./img/prod1008-1.png'),
  'prod1009-1.png': require('./img/prod1009-1.png'),
  'prod1010-1.png': require('./img/prod1010-1.png'),
  'prod1011-1.png': require('./img/prod1011-1.png'),
  'prod1012-1.png': require('./img/prod1012-1.png'),
  'prod1013-1.png': require('./img/prod1013-1.png'),
  'prod1014-1.png': require('./img/prod1014-1.png'),
  'prod1015-1.png': require('./img/prod1015-1.png'),
  'prod1016-1.png': require('./img/prod1016-1.png'),
  'prod1017-1.png': require('./img/prod1017-1.png'),
  'prod1018-1.png': require('./img/prod1018-1.png'),
  'prod1019-1.png': require('./img/prod1019-1.png'),
  'prod1020-1.png': require('./img/prod1020-1.png'),
  'prod1021-1.png': require('./img/prod1021-1.png'),
  'prod1022-1.png': require('./img/prod1022-1.png'),
  'prod1023-1.png': require('./img/prod1023-1.png'),
  'prod1024-1.png': require('./img/prod1024-1.png'),
};

export const getImage = (imageName) => {
  if (!imageName) return null;
  // Extract filename if it contains a path
  const filename = imageName.split('/').pop();
  return IMAGES[filename] || null;
};

export default IMAGES;
