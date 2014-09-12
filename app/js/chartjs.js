/*
 * Imports.
 */
define([

  // Templates.
  'text!templates/chart.html',

  // Libraries.
  'vendor/chartjs/Chart.min'

], function(chartTemplate) {

  /*
   * Chart.js Chart View.
   */
  App.Views.Chartjs = Backbone.View.extend({
    
    initialize: function(options) {

      // Constructor vars (other than Backbone's defaults).
      this.options = options || {};

      // Template.
      this.template = _.template(chartTemplate);

      // Chart.
      this.chart = undefined;

    },

    render: function() {

      // Render base template.
      $(this.el).html(this.template({ id: this.id }));

      // Render chart.
      this.chart = new App.Views.ChartjsGraph();
      this.$('.chart').html(this.chart.render().el);

      // Return.
      return this;
    },

    addData: function(data) {
      this.chart.addData(data);
    }
  });

  /* 
   * Draw Graph.
   */
  App.Views.ChartjsGraph = Backbone.View.extend({

    tagName: 'canvas',

    initialize: function(options) {

      // Constructor vars (other than Backbone's defaults).
      this.options = options || {};

      // Chart.
      this.graph = undefined;
      this.data = {
        labels: [],
        datasets: [{
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: []
        }]
      };

    },

    render: function() {
      $(this.el).attr('width', 400).attr('height', 400);
      return this;
    },

    addData: function(data) {
      
      var xLabel = (data[0].getTime() / 1000) + '';

      // Process data.
      this.data.labels.push(xLabel);
      //this.data.datasets[0].data.push(data[1]);

      console.log(this.data);

      // Initialize graph.
      if (!this.graph) {
        this.graph = new Chart(this.el.getContext('2d')).Line(this.data);
      }

      // Update graph.
      this.graph.addData([data[1]], xLabel);
    }
  });

});