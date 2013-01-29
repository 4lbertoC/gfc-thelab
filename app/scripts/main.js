require.config({
  shim: {
    'app': {
        deps: ['config']
    },
    'buzz': {
        deps: ['buzz-wrapped']
    },
    'prefixfree': {
        deps: ['prefixfree-wrapped']
    },
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
    },
    'jquery-mutationSummary': {
        deps: ['jquery', 'mutationSummary']
    }
  },

  paths: {
    'jquery': 'vendor/jquery.min',
    'jquery-ui': 'jquery/jquery-ui-1.9.2.custom',
    'jquery-terminal': 'jquery/jquery.terminal-0.4.22',
    'jquery-mousewheel': 'jquery/jquery.mousewheel-min',
    'jquery-customScrollbar': 'jquery/jquery.mCustomScrollbar',
    'jquery-tinyPubSub': 'jquery/jquery.tinypubsub-0.7',
    'jquery-mutationSummary': 'jquery/jquery.mutation-summary',
    'codeMirror': 'codemirror/lib/codemirror',
    'codeMirror-js': 'codemirror/mode/javascript/javascript',
    'codeMirror-formatting': 'codemirror/formatting',
    'buzz': 'wrappers/buzz',
    'buzz-wrapped': 'buzz/buzz',
    'mutationSummary': 'mutation_summary/mutation_summary',
    'prefixfree': 'wrappers/prefixfree',
    'prefixfree-wrapped': 'prefixfree/prefixfree.min'
  }
});
 
require(['app', 'config', 'gamestrings',
    'jquery', 'jquery-ui', 'jquery-terminal', 'jquery-mousewheel', 'jquery-customScrollbar',
    'jquery-tinyPubSub', 'jquery-mutationSummary', 'codeMirror', 'codeMirror-js', 'codeMirror-formatting', 'buzz-wrapped', 'buzz', 'mutationSummary', 'prefixfree'],
    function(app) {
        'use strict';
  // use app here
  app.init();
});