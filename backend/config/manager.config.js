module.exports = (filename) => {
	const path = require('path');

	const file = path.basename(filename);
	const fileName = file.substring(0, file.indexOf('.'));
	
	const manager = {
    	fileName: fileName
  	};

  	return manager;
}