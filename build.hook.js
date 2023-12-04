let fs = require("fs");
let path = require("path");

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

function _before() {
  if(process.env.NODE_ENV === 'backend') {
    console.log('build before backend.');
    const filePath = path.join(__dirname, './.config.backend.json');
    const destPath = path.join(__dirname, './src/config.json');
    if(fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, destPath);
    }
  } else if(process.env.NODE_ENV === 'frontend') {
    console.log('before frontend.');
    const filePath = path.join(__dirname, './.config.frontend.json');
    const destPath = path.join(__dirname, './src/config.json');
    if(fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, destPath);
    }
  } else {
    console.log('before local.');
    const filePath = path.join(__dirname, './.config.local.json');
    const destPath = path.join(__dirname, './src/config.json');
    if(fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, destPath);
    }
  }
}

function _after() {
  console.log('build after.');
  const destPath = path.join(__dirname, './src/config.json');
  fs.writeFileSync(destPath, '{}');
}

// console.log(process.argv);
if(process.argv.length > 2 && process.argv[2] === 'before') {
  _before();
} else if(process.argv.length > 2 && process.argv[2] === 'after') {
  _after();
} else {
  console.error('invalid parameters.');
}