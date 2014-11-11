linester
========

Draws lines on charts with different libraries to help with performance bencharking.

We had a few performance with highcharts rendering thousands of series lines so this was our crude experiment to see if other librarys were better.

We simply looked at chrome cpu / memory but there are plans to extend it with more libraries and some numbers in the app eventually. FYI we went with Rickshaw in the end and then built extra functionality on top.

![linester](https://raw.githubusercontent.com/dataloop/linester/master/linester.png)

Installation
============

1. Clone repository

2. npm install

3. node server.js

4. browse http://localhost:3000
