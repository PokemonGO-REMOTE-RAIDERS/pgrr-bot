const setUserInfo = require('../util/setUserInfo.js');
module.exports = async function setUserInfoObject(userInfos) {

	/**
	 * Expecting this for userInfos
	 *
	let userInfos = [
		{sheetIndex: 0, user: user , data: '', value: ''},
		{sheetIndex: 0, user: user , data: '', value: ''},
		{sheetIndex: 0, user: user , data: '', value: ''},
		{sheetIndex: 0, user: user , data: '', value: ''}
	];
	**/
	// TODO: THIS IS is still not working.

	const promises = [];
	for (const userInfo of userInfos) {
		// console.log(userInfo);
		promises.push(setUserInfo(userInfo.sheetIndex, userInfo.user, userInfo.data, userInfo.value, false));
	}

	Promise.all(promises).then(() => {
		// console.log(values);
	});
};