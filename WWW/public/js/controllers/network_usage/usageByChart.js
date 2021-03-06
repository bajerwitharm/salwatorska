salwatorskaControllers
	.controller(
		'networkUsageByChartController',
		[
			'$scope',
			'$rootScope',
			'$filter',
			'orderByFilter',
			'databaseProvider',
			function($scope, $rootScope, $filter, orderByFilter,
				databaseProvider) {
			    var chartToShow = "weekday";

			    var getUsageBy = function() {
				if ($scope.selectedView=='weekdays') getUsageByWeekday();
				if ($scope.selectedView=='monthdays') getUsageByMonthday();
				if ($scope.selectedView=='months') getUsageByMonth();
				if ($scope.selectedView=='hours') getUsageByHour();
			    };
			    
			    var getUsageByHour = function() {
				databaseProvider.getUsageByHour().success(
					function(data) {
					    usageByHour = data;
					    prepareUsageByHourChart();
					}).error(function() {
				});
			    }
			    
			    var getUsageByWeekday = function() {
				databaseProvider.getUsageByWeekday().success(
					function(data) {
					    usageByWeekday = data;
					    prepareUsageByWeekdayChart();
					}).error(function() {
				});
			    }
			    
			    var getUsageByMonthday = function() {
				databaseProvider.getUsageByMonthday().success(
					function(data) {
					    usageByMonthday = data;
					    prepareUsageByMonthdayChart();
					}).error(function() {
				});
			    }
			    
			    var getUsageByMonth = function() {
				databaseProvider.getUsageByMonth().success(
					function(data) {
					    usageByMonth = data;
					    prepareUsageByMonthChart();
					}).error(function() {
				});
			    }

			    var prepareUsageByHourChart = function() {
				$scope.usageByChart = [];
				$rootScope.filteredUsersInfo.forEach(function(
					entry) {
				    if (!entry.name) {
					entry.name = entry.account;
				    }
				    $scope.usageByChart
					    .push({
						"key" : entry.name,
						"values" : [ [ 0, 0 ],
							[ 1, 0 ], [ 2, 0 ],
							[ 3, 0 ], [ 4, 0 ],
							[ 5, 0 ], [ 6, 0 ],
							[ 7, 0 ], [ 8, 0 ],
							[ 09, 0 ], [ 10, 0 ],
							[ 11, 0 ], [ 12, 0 ],
							[ 13, 0 ], [ 14, 0 ],
							[ 15, 0 ], [ 16, 0 ],
							[ 17, 0 ], [ 18, 0 ],
							[ 19, 0 ], [ 20, 0 ],
							[ 21, 0 ], [ 22, 0 ],
							[ 23, 0 ] ]
					    });
				});

				usageByHour
					.forEach(function(entry) {
					    if (entry.name==null) {
						entry.name = entry.account;
					    }
					    var element_index = $rootScope
						    .findItem(
							    $rootScope.filteredUsersInfo,
							    "name", entry.name);
					    if (element_index >= 0) {
						$scope.usageByChart[element_index].values[Number(entry.hour)] = [
							Number(entry.hour),
							entry.data_in ];
					    }
					});
			    }

			    var prepareUsageByWeekdayChart = function() {
				$scope.usageByChart = [];
				$rootScope.filteredUsersInfo.forEach(function(
					entry) {
				    if (!entry.name) {
					entry.name = entry.account;
				    }
				    $scope.usageByChart
					    .push({
						"key" : entry.name,
						"values" : [ [ 0, 0 ],
							[ 1, 0 ], [ 2, 0 ],
							[ 3, 0 ], [ 4, 0 ],
							[ 5, 0 ], [ 6, 0 ]]
					    });
				});

				usageByWeekday
					.forEach(function(entry) {
					    var element_index = $rootScope
						    .findItem(
							    $rootScope.filteredUsersInfo,
							    "name", entry.name);
					    if (element_index >= 0) {
						$scope.usageByChart[element_index].values[Number(entry.weekday)] = [
							Number(entry.weekday),
							entry.data_in ];
					    }
					});
			    }

			    var prepareUsageByMonthdayChart = function() {
				$scope.usageByChart = [];
				$rootScope.filteredUsersInfo.forEach(function(
					entry) {
				    if (!entry.name) {
					entry.name = entry.account;
				    }
				    $scope.usageByChart
					    .push({
						"key" : entry.name,
						"values" : [ [ 1, 0 ],
								[ 2, 0 ], [ 3, 0 ],
								[ 4, 0 ], [ 5, 0 ],
								[ 6, 0 ], [ 7, 0 ],
								[ 8, 0 ], [ 9, 0 ],
								[ 10, 0 ], [ 11, 0 ],
								[ 12, 0 ], [ 13, 0 ],
								[ 14, 0 ], [ 15, 0 ],
								[ 16, 0 ], [ 17, 0 ],
								[ 18, 0 ], [ 19, 0 ],
								[ 20, 0 ], [ 21, 0 ],
								[ 22, 0 ], [ 23, 0 ],
								[ 24, 0 ], [ 25, 0 ],
								[ 26, 0 ], [ 27, 0 ],
								[ 28, 0 ], [ 29, 0 ],
								[ 30, 0 ], [ 31, 0 ]]
					    });
				});

				usageByMonthday
					.forEach(function(entry) {
					    if (!entry.name) {
						entry.name = entry.account;
					    }
					    var element_index = $rootScope
						    .findItem(
							    $rootScope.filteredUsersInfo,
							    "name", entry.name);
					    if (element_index >= 0) {
						$scope.usageByChart[element_index].values[Number(entry.monthday)-1] = [
							Number(entry.monthday),
							entry.data_in ];
					    }
					});
			    }
			    
			    var prepareUsageByMonthChart = function() {
				$scope.usageByChart = [];
				$rootScope.filteredUsersInfo.forEach(function(
					entry) {
				    if (!entry.name) {
					entry.name = entry.account;
				    }
				    $scope.usageByChart
					    .push({
						"key" : entry.name,
						"values" : [ [ 1, 0 ],
								[ 2, 0 ], [ 3, 0 ],
								[ 4, 0 ], [ 5, 0 ],
								[ 6, 0 ], [ 7, 0 ],
								[ 8, 0 ], [ 9, 0 ],
								[ 10, 0 ], [ 11, 0 ],
								[ 12, 0 ]]
					    });
				});

				usageByMonth
					.forEach(function(entry) {
					    if (!entry.name) {
						entry.name = entry.account;
					    }
					    var element_index = $rootScope
						    .findItem(
							    $rootScope.filteredUsersInfo,
							    "name", entry.name);
					    if (element_index >= 0) {
						$scope.usageByChart[element_index].values[Number(entry.month)-1] = [
							Number(entry.month),
							entry.data_in ];
					    }
					});
			    }

			    
			    $scope.xAxisTickFormat = function() {
				return function(d) {
				    weekdays = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
				    if ($scope.selectedView == 'weekdays') return weekdays[d];
				    return d;
				}
			    };
			    
			    $scope.yAxisTickFormat = function() {
				return function(d) {
				    return $filter('bytesFilter')(d);
				}
			    };

			    $scope.toolTipContentFunction = function() {
				return function(key, x, y, e, graph) {
				    return '<h1>' + key + '</h1>' + '<p>'
					    + y
					    + ' danych o ' + x + '</p>'
				}
			    };
			    
			    $scope.changeSelectedView = function(view) {
				$scope.selectedView = view;
				getUsageBy();
			    }

			    $scope.$on('networkUsersGetAllDataAgain',
				    getUsageBy);

			} ]);