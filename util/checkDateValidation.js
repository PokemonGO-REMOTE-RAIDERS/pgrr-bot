module.exports = function checkDateValidation(startDate, endDate, dateToCheck) {
	this.dateToCheck =
		dateToCheck !== undefined ? new Date(dateToCheck) : new Date();
	this.startDate = startDate;
	this.endDate = endDate;

	if (
		this.dateToCheck.getTime() > this.startDate.getTime() &&
		this.dateToCheck.getTime() < this.endDate.getTime()
	) {
		return 'open';
	} else if (this.dateToCheck.getTime() < this.startDate.getTime()) {
		return 'early';
	} else if (this.dateToCheck.getTime() > this.endDate.getTime()) {
		return 'late';
	}
};
