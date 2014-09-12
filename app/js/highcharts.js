/*
 * Imports.
 */
define([

  // Templates.
  'text!templates/chart.html',

  // Libraries.
  'vendor/highcharts/highcharts-4.0.3'

], function(chartTemplate) {

  /*
   * Highcharts Chart View.
   */
  App.Views.Highcharts = Backbone.View.extend({
    
    initialize: function(options) {

      // Constructor vars (other than Backbone's defaults).
      this.options = options || {};

      // Template.
      this.template = _.template(chartTemplate);

      // Chart.
      this.chart = undefined;
      this.series = [{
        data: []
      }];

    },

    render: function() {

      // Render base template.
      $(this.el).html(this.template({ id: this.id }));

      // Return.
      return this;
    },

    addData: function(data) {
      this.series[0].data.push(data[1]);
      if (!this.graph) {
        var chartCont = this.$('.chart').highcharts({ series: this.series });
        this.graph = Highcharts.charts[chartCont.data('highchartsChart')];
      } else {
        this.graph.series[0].setData(this.series[0].data, true);  
      }
    }
  });

});