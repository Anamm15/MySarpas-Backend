function formatTimeToString(time) {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
}

function parseTimeToDate(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(0);
    date.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
}


module.exports = {
    formatTimeToString,
    parseTimeToDate,
}
