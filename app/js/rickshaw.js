/*
 * Imports.
 */
define([

  // Templates.
  'text!templates/chart.html',

], function(chartTemplate) {

  /*
   * Rickshaw Chart View.
   */
  App.Views.Rickshaw = Backbone.View.extend({
    
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

    addData: function(data) {
      this.data.push({ x: data[0].getTime() / 1000, y: data[1] }); // Dates have to be converted to epoch (data[0]).
      if (!this.graph) {
        this.graph = new Rickshaw.Graph({
          element: this.$('.chart')[0],
          width: 580,
          height: 250,
          renderer: 'line',
          series: [{
            color: 'steelblue',
            name: 'Value',
            data: this.data
          }]
        });
        var hoverDetail = new Rickshaw.Graph.HoverDetail({ graph: this.graph });
        var axes = new Rickshaw.Graph.Axis.Time({ graph: this.graph });
      } else {
        this.graph.configure({
          series: [{
            data: this.data
          }]
        });
      }
      this.graph.render();
    }
  });

});