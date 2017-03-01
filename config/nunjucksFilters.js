module.exports = function(env) {
  env.addFilter('getDate', function(datetime) {
    var date = new Date(datetime);
    var day = date.getDate().toString() < 10 ? '0' + date.getDate().toString() : date.getDate().toString();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
    var year = date.getFullYear().toString();

    return day + '/' + month + '/' + year;
  });

  env.addFilter('translateStatus', function(statusId) {
    if (statusId == 0) return 'Finalizada';
    if (statusId == 1) return 'Em andamento';
  });
};
