var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'TheTriangulator',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'TheTriangulator',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

