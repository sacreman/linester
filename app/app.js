'use strict';

/*
 * Configure aliases for CSS/Text plugins.
 */
require.config({
  paths: {
    'css': 'vendor/requirejs/css.min',
    'text': 'vendor/requirejs/text'
  },
});

/*
 * Application namespace.
 */
window.App = {
  Collections: {},
  Models: {},
  Views: {}
};

/*
 * Imports.
 */
define([

  // Templates.
  'text!templates/main.html',

  // CSS.
  'css!styles/styles.css',

  // Chart Views.
  'js/chartjs',
  'js/dygraphs',
  'js/rickshaw',
  'js/highcharts'

], function(mainTemplate) {

  /*
   * Main view: Initializes the application.
   */
  App.Views.Main = Backbone.View.extend({

    el: $('#container'),
    
    initialize: function() {

      // Template source.
      this.template = _.template(mainTemplate);

      // Charts & Stuff.
      this.charts = {};
      this.metricGenerators = {};

      // Main view, self-render please.
      this.render();
    },

    render: function() {

      // Render base template.
      $(this.el).html(this.template());

      // Return.
      return this;
    },

    events: {
      'change #menu fieldset #source': 'updateSource',
      'click #menu fieldset #start': 'start',
      'click #menu fieldset #stop': 'stop',
      'click #menu fieldset #clear': 'clear'
    },

    newChart: function(id, history) {
      var library = this.$('#menu fieldset #library').val();
      
      // dygraphs.
      if (library === 'dygraphs') {
        return new App.Views.Dygraphs({ id: id, history: history });
      }

      // Rickshaw.
      else if (library === 'rickshaw') {
        return new App.Views.Rickshaw({ id: id, history: history  });
      }

      // Chart.js
      else if (library === 'chartjs') {
        return new App.Views.Chartjs({ id: id, history: history });
      }

      // Highcharts.
      else if (library == 'highcharts') {
        return new App.Views.Highcharts({ id: id, history: history });
      }

      // Invalid chart library.
      else {
        new PNotify({
          title: 'Error',
          text: 'Invalid library',
          type: 'error'
        });
      }
    },

    renderChart: function(chart, data, history) {

      // Render.
      this.$('#dashboard').append(new App.Views.Chart({ chart: chart }).render().el);

      // If history, add it.
      if (history) {
        chart.addHistory(history);
      }
      
      // If metric, add it.
      if (data) {
        chart.addData(data);
        // Update stat.
        var size = 0, key;
        for (key in this.charts) {
          if (this.charts.hasOwnProperty(key)) {
            size++;
          }
        }
        this.$('#stats #totalCharts').html(size);
      }

    },

    initializeMetricGenerator: function(chart, resolution) {
      var metric = setInterval(function() {
        chart.addData([new Date(), Math.random()]);
        this.incrementTotalMetrics();
      }.bind(this), resolution);
      this.metricGenerators[chart.id] = metric;
    },

    incrementTotalMetrics: function() {
      var totalMetrics = parseInt(this.$('#stats #totalMetrics').html(), 10);
      this.$('#stats #totalMetrics').html(++totalMetrics);
    },

    updateSource: function() {
      var source = this.$('#menu fieldset #source').val();
      if (source === 'random') {
        this.$('.random-params').show();
      } else {
        this.$('.random-params').hide();
      }
    },

    start: function() {

      //
      // Initialize.
      //

      // Clear.
      this.clear();

      // Vars.
      var source = this.$('#menu fieldset #source').val();
      var library = this.$('#menu fieldset #library').val();
      this.$('#menu fieldset #start').attr('disabled', true);
      this.$('#menu fieldset #stop').attr('disabled', false);
      this.$('#menu fieldset #clear').attr('disabled', true);
      console.log('Start', { source: source, library: library });

      //
      // Random metrics.
      //
      if (source === 'random') {

        // Params.
        var charts = parseInt(this.$('#menu fieldset #charts').val(), 10);
        var resolution = parseInt(this.$('#menu fieldset #resolution').val(), 10);
        
        // Validate params.
        if (isNaN(charts) || isNaN(resolution)) {
          new PNotify({
            title: 'Error',
            text: 'Invalid parameters. Please provider integer values.',
            type: 'error'
          });
          this.$('#menu fieldset #start').attr('disabled', false);
          this.$('#menu fieldset #stop').attr('disabled', true);
        }

        // Create charts.
        for (var i=0; i<charts; i++) {
          var chart = this.newChart(i);
          this.charts[i] = chart;
          this.$('#dashboard').append(new App.Views.Chart({ chart: chart }).render().el);
          var totalCharts = i+1;
          this.$('#stats #totalCharts').html(totalCharts);

          // Initialize random metric generator.
          this.initializeMetricGenerator(chart, resolution);
        }
      }

      //
      // Invalid source.
      //
      else {
        new PNotify({
          title: 'Error',
          text: 'Invalid source',
          type: 'error'
        });
        this.$('#menu fieldset #start').attr('disabled', false);
        this.$('#menu fieldset #stop').attr('disabled', true);
      }
    },

    stop: function() {

      // Vars.
      var source = this.$('#menu fieldset #source').val();
      this.$('#menu fieldset #start').attr('disabled', false);
      this.$('#menu fieldset #stop').attr('disabled', true);
      this.$('#menu fieldset #clear').attr('disabled', false);
      console.log('Stop', source);

      // Stop metric generators.
      var key;
      for (key in this.metricGenerators) {
        clearInterval(this.metricGenerators[key]);
        delete this.metricGenerators[key];
      }
    },

    clear: function() {
      
      // Clear stats.
      this.$('#stats #totalMetrics').html('0');
      this.$('#stats #totalCharts').html('0');

      // Delete chart views.
      var key;
      for (key in this.charts) {
        this.charts[key].remove();
        delete this.charts[key];
      }
    }

  });
  var app = new App.Views.Main();

  /*
   * Chart slot.
   */
  App.Views.Chart = Backbone.View.extend({

    //className: 'col-md-2',

    initialize: function(options) {
      this.options = options || {};
    },

    render: function() {
      $(this.el).html(this.options.chart.render().el);
      return this;
    }

  });
});