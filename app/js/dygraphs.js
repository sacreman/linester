/*
 * Imports.
 */
define([

  // Templates.
  'text!templates/chart.html',

  // Libraries
  '//dygraphs.com/dygraph-combined.js'

], function(chartTemplate) {

  /*
   * Dygraphs Chart View.
   */
  App.Views.Dygraphs = Backbone.View.extend({
    
    initialize: function(options) {

      // Constructor vars (other than Backbone's defaults).
      this.options = options || {};

      // Template.
      this.template = _.template(chartTemplate);

      // Chart.
      this.graph = undefined;
      this.data = [];
    },

    render: function() {

      // Render base template.
      $(this.el).html(this.template({ id: this.id }));

      // Return.
      return this;
    },

    addHistory: function(history) {

      // Parse data.
      for (var i=0; i<history.length; i++) {
        for (var j=0; j<history[i].points.length; j++) {
          this.data.push([history[i].points[j].time, history[i].points[j].avg]);
        }
      }

      // Draw graph.
      this.graph = new Dygraph(this.$('.chart')[0], this.data, {
        labels: ['Time', 'Value'],
      });
    },

    addData: function(data) {
      this.data.push([data[0].getTime() / 1000 + 2307869.019999981, data[1]]);
      if (!this.graph) {
        this.graph = new Dygraph(this.$('.chart')[0], this.data, {
          //drawPoints: true,
          //showRoller: true,
          //valueRange: [0.0, 100.0],
          labels: ['Time', 'Value'],
        });
      } else {
        this.graph.updateOptions({ 'file': this.data });
      }
      
    }

  });

});