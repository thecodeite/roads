if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function () {
  'use strict';

  return function JsonFormater(options) {

    if(options === undefined){
      options = {
        indent: '  '
      };
    }

    function formatArray(array, state) {
      if(array.length === 0) {
        state.child = 'empty-array';
        return {res: '[]', state: state};
      }

      if(state.touched.indexOf(array) != -1){
        state.child = 'recursive';
        return {res: '[recursive]', state: state};
      }
      state.touched.push(array);

      //console.log('formatArray', state, array);
      var bits = [];
      var render = 'inline';
      state.indent.push(options.indent);

      array.forEach(function (item) {
        var rendered = formatDetect(item, state);
        bits.push(rendered.res);

        if(rendered.state.child === 'object'){
          render = 'lined';
        }
      });

      var fullIndent = state.indent.join('');
      state.indent.shift();
      var halfIndent = state.indent.join('');

      var res = '[';
      var first = true;

      if(render === 'inline') {
        
        bits.forEach(function (item) {
          if(!first) {
            res += ', ';
          }
          first = false;
          res += item;
        });

      } else {
        
        bits.forEach(function (item) {
          if(first) {
            res += '\n';
          } else {
            res += ',\n';
          }
          first = false;        
          
          res += fullIndent + item;
        });
        res += '\n' + halfIndent;
      }
      res +=  ']';

      state.touched.pop();
      state.child = 'array';
      //console.log('end formatArray', res);
      return {res: res, state: state};
    }

    function formatObject(obj, state) {
      if(Object.keys(obj).length === 0) {
        state.child = 'empty-object';
        return {res: '{}', state: state};
      }

      if(state.touched.indexOf(obj) != -1){
        state.child = 'recursive';
        return {res: '[recursive]', state: state};
      }
      state.touched.push(obj);

      var bits = {};
      var render = 'inline';

      state.indent.push(options.indent);

      Object.keys(obj).forEach(function(index){
        var rendered = formatDetect(obj[index], state);
        bits[index] = rendered.res;

        if(rendered.state.child === 'array'){
          render = 'lined';
        }
      });

      var fullIndent = state.indent.join('');
      state.indent.shift();
      var halfIndent = state.indent.join('');

      var res = '{';
      var first = true;
      if(render === 'inline') {
        Object.keys(obj).forEach(function(index){

          if(!first){
            res += ', ';
          }
          first = false;
          res += '"' + index + '": ' + bits[index];
        });
      } else {
         
         Object.keys(obj).forEach(function(index){

          if(first){
            res += '\n';
          } else {
            res += ',\n';
          }
          first = false;
          res += fullIndent +'"' + index + '": ' + bits[index];
        });
        res += '\n' + halfIndent;
      }

      res += '}';

     
      state.touched.pop();
      state.child = 'object';
      //console.log('end formatObject', obj);
      return {res: res, state: state};
    }

    function formatDetect (obj, state) {
      switch(typeof(obj)) {

        case 'number':
          state.child = 'number';
          return {res: obj, state: state};
        
        case 'string':
          state.child = 'string';
          return {res:'"' + obj.replace(/"/g, '\"') + '"', state: state};
        
        case 'boolean':
          state.child = 'boolean';
          return {res:obj?'true':'false', state: state};

        case 'function':
          state.child = 'function';
          return {res:'[Function]', state: state};

        case 'undefined':
          state.child = 'undefined';
          return {res:'undefined', state: state};
        
        case 'object':
          if(obj === null) {
            state.child = 'null';
            return {res:'null', state: state};
          } else if (obj.constructor === Array){
            return formatArray(obj, state);
          } else {
            return formatObject(obj, state);
          }
          throw "Case of 'object' not defined";
        default:
          throw "Unknown object type: "+typeof(obj); 
      }
    }

    function format(obj) {
      return formatDetect(obj, {indent:[], touched:[]}).res;
    }

    return {
      format: format
    };
  };
});