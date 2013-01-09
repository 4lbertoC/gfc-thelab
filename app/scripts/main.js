require.config({
  shim: {
    'codeMirror-js': {
        deps: ['codeMirror']
    },
    'codeMirror-formatting': {
        deps: ['codeMirror']
    },
    'jquery-ui': {
        deps: ['jquery']
    },
    'jquery-terminal': {
        deps: ['jquery']
    },
    'jquery-mousewheel': {
        deps: ['jquery']
    },
    'jquery-customScrollbar': {
        deps: ['jquery']
    },
    'jquery-tinyPubSub': {
        deps: ['jquery']
    }
  },

  paths: {
    'jquery': 'vendor/jquery.min',
    'jquery-ui': 'jquery/jquery-ui-1.9.2.custom',
    'jquery-terminal': 'jquery/jquery.terminal-0.4.22',
    'jquery-mousewheel': 'jquery/jquery.mousewheel-min',
    'jquery-customScrollbar': 'jquery/jquery.mCustomScrollbar',
    'jquery-tinyPubSub': 'jquery/jquery.tinypubsub-0.7',
    'codeMirror': 'codemirror/lib/codemirror',
    'codeMirror-js': 'codemirror/mode/javascript/javascript',
    'codeMirror-formatting': 'codemirror/formatting',
    'buzz': 'buzz/buzz'
  }
});
 
require(['app', 'jsbugslab', 'gamestrings',
    'jquery', 'jquery-ui', 'jquery-terminal', 'jquery-mousewheel', 'jquery-customScrollbar',
    'jquery-tinyPubSub', 'codeMirror', 'codeMirror-js', 'codeMirror-formatting', 'buzz'],
    function(app) {
  // use app here
  game.run();
  app.init();
});