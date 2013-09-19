Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        this.getData();
    },
    getData: function() {
        
        var myFilters = Ext.create('Rally.data.QueryFilter', {
             property: 'ScheduleState',
             operator: '=',
             value: 'Defined'
        });
        var myFilters = myFilters.or(
            Ext.create('Rally.data.QueryFilter', {
                 property: 'ScheduleState',
                 operator: '=',
                 value: 'In-Progress'
            }) 
        );
        var myFilters = myFilters.or(
            Ext.create('Rally.data.QueryFilter', {
                 property: 'ScheduleState',
                 operator: '=',
                 value: 'Completed'
            }) 
        );
        var myFilters = myFilters.or(
            Ext.create('Rally.data.QueryFilter', {
                 property: 'ScheduleState',
                 operator: '=',
                 value: 'Accepted'
            }) 
        );

        Ext.create('Rally.data.WsapiDataStore', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(store, records, success) {
                    this.aggregateData(records);
                },
                scope: this
            },
            filters: myFilters,
            fetch: ['Name', 'ScheduleState']
        });

    },
    aggregateData: function(storyRecords) {
        
        var myData = {
            'Defined': 0,
            'In-Progress': 0,
            'Completed': 0,
            'Accepted': 0
        };
        
        Ext.Array.each(storyRecords, function(record) {
            myData[record.get("ScheduleState")]++;
        });

        this.renderChart(myData);
    },
    renderChart: function(myData) {

        var myChartConfig = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'User Stories'
            },
            subtitle: {
                text: 'Count by Schedule State'
            },
            xAxis: {
                categories: [
                    'User Stories'
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count'
                }
            },
            tooltip: {
                headerFormat: '<table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: false,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
        };
        
        var myChartData = {
            series: [{
                name: 'Backlog',
                data: [myData['Defined']]
            },{
                name: 'In-Progress',
                data: [myData['In-Progress']]
            }, {
                name: 'Completed',
                data: [myData['Completed']]
            }, {
                name: 'Accepted',
                data: [myData['Accepted']]
            },]
        };

        var myChart = Ext.create('Rally.ui.chart.Chart', {
            chartConfig: myChartConfig,
            chartData: myChartData
        });
        
        this.add(myChart);
    }
});
