const IMAGES = {
  'paypal.png': require('./img/paypal.png'),
  'PayPal.svg.png': require('./img/paypal.png'), // Legacy key for compatibility
  'apay.png': require('./img/apay.png'),
  'apay.svg.png': require('./img/apay.png'), // Legacy key for compatibility
  'bancoestado.png': require('./img/bancoestado.png'),
  'bancoEstado.svg.png': require('./img/bancoestado.png'), // Legacy key for compatibility
  'gpay.png': require('./img/gpay.png'),
  'gpay.svg.png': require('./img/gpay.png'), // Legacy key for compatibility
  'mllogo.png': require('./img/mllogo.webp'),
  'ml-logo.svg.png': require('./img/mllogo.webp'), // Legacy key for compatibility
  'mllogo.webp': require('./img/mllogo.webp'),
  'placeholder.png': require('./img/placeholder.png'),
  'prod1001-1.png': require('./img/prod1001_1.png'),
  'prod1001_1.png': require('./img/prod1001_1.png'),
  'prod1001-2.png': require('./img/prod1001_2.png'),
  'prod1001_2.png': require('./img/prod1001_2.png'),
  'prod1002-1.png': require('./img/prod1002_1.png'),
  'prod1002_1.png': require('./img/prod1002_1.png'),
  'prod1003-1.png': require('./img/prod1003_1.png'),
  'prod1003_1.png': require('./img/prod1003_1.png'),
  'prod1004-1.png': require('./img/prod1004_1.png'),
  'prod1004_1.png': require('./img/prod1004_1.png'),
  'prod1005-1.png': require('./img/prod1005_1.png'),
  'prod1005_1.png': require('./img/prod1005_1.png'),
  'prod1006-1.png': require('./img/prod1006_1.png'),
  'prod1006_1.png': require('./img/prod1006_1.png'),
  'prod1007-1.png': require('./img/prod1007_1.png'),
  'prod1007_1.png': require('./img/prod1007_1.png'),
  'prod1008-1.png': require('./img/prod1008_1.png'),
  'prod1008_1.png': require('./img/prod1008_1.png'),
  'prod1009-1.png': require('./img/prod1009_1.png'),
  'prod1009_1.png': require('./img/prod1009_1.png'),
  'prod1010-1.png': require('./img/prod1010_1.png'),
  'prod1010_1.png': require('./img/prod1010_1.png'),
  'prod1011-1.png': require('./img/prod1011_1.png'),
  'prod1011_1.png': require('./img/prod1011_1.png'),
  'prod1012-1.png': require('./img/prod1012_1.png'),
  'prod1012_1.png': require('./img/prod1012_1.png'),
  'prod1013-1.png': require('./img/prod1013_1.png'),
  'prod1013_1.png': require('./img/prod1013_1.png'),
  'prod1014-1.png': require('./img/prod1014_1.png'),
  'prod1014_1.png': require('./img/prod1014_1.png'),
  'prod1015-1.png': require('./img/prod1015_1.png'),
  'prod1015_1.png': require('./img/prod1015_1.png'),
  'prod1016-1.png': require('./img/prod1016_1.png'),
  'prod1016_1.png': require('./img/prod1016_1.png'),
  'prod1017-1.png': require('./img/prod1017_1.png'),
  'prod1017_1.png': require('./img/prod1017_1.png'),
  'prod1018-1.png': require('./img/prod1018_1.png'),
  'prod1018_1.png': require('./img/prod1018_1.png'),
  'prod1019-1.png': require('./img/prod1019_1.png'),
  'prod1019_1.png': require('./img/prod1019_1.png'),
  'prod1020-1.png': require('./img/prod1020_1.png'),
  'prod1020_1.png': require('./img/prod1020_1.png'),
  'prod1021-1.png': require('./img/prod1021_1.png'),
  'prod1021_1.png': require('./img/prod1021_1.png'),
  'prod1022-1.png': require('./img/prod1022_1.png'),
  'prod1022_1.png': require('./img/prod1022_1.png'),
  'prod1023-1.png': require('./img/prod1023_1.png'),
  'prod1023_1.png': require('./img/prod1023_1.png'),
  'prod1024-1.png': require('./img/prod1024_1.png'),
  'prod1024_1.png': require('./img/prod1024_1.png'),
};

export const getImage = (imageName) => {
  if (!imageName) return null;
  // Extract filename if it contains a path
  const filename = imageName.split('/').pop();
  return IMAGES[filename] || null;
};

export default IMAGES;
