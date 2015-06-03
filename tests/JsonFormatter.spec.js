var assert = require("assert");
var JsonFormater = require('../scripts/JsonFormater');


describe('JsonFormatter', function() {

  var formatter;
  beforeEach(function (){
    formatter = new JsonFormater();
  });

  describe('basic values', function() {
    it('should be able to format an integer', function(){
      assert.equal('55', formatter.format(55));
    });

    it('should be able to format a string', function(){
      assert.equal('"sam"', formatter.format('sam'));
    });

    it('should be able to format a boolean', function() {
      assert.equal('true', formatter.format(true));
      assert.equal('false', formatter.format(false));
    });

    it('should be able to foramt null', function() {
      assert.equal('null', formatter.format(null));
    });
  });

  describe('arrays', function() {
    it('should be able to format an empty array', function(){
      assert.equal('[]', formatter.format([]));
    });

    it('should format an array of numbers in line', function(){
      assert.equal('[1, 2, 3]', formatter.format([1, 2, 3]));
    });

    it('should format an array of string in line', function(){
      assert.equal('["sam", "tom", "ben"]', formatter.format(['sam', 'tom', 'ben']));
    });

    it('should format a simple array of arrays in line', function(){
      assert.equal('[[1, 2, 3], ["a", "b", "c"], []]', formatter.format([[1,2,3], ['a', 'b', 'c'], []]));
    });

    it('should put an array containg object over many lines', function(){
      var expected = '[\n' +
      '  1,\n' +
      '  "a",\n' +
      '  {"b": 1},\n' +
      '  true\n' +
      ']';
      assert.equal(formatter.format([ 1, "a", {"b": 1}, true ]), expected);
    });

    it('should put an array containg empty object inline', function(){
      var expected = '[1, "a", {}, true]';
      assert.equal(formatter.format([1, "a", {}, true ]), expected);
    });
  });

  describe('object', function() {
    it('should be able to format an empty object', function(){
      assert.equal('{}', formatter.format( {} ));
    });

    it('should format an object of numbers in line', function(){
      assert.equal('{"a": 1, "b": 2, "c": 3}', formatter.format({a:1, b:2, c:3}));
    });

    it('should format an object of string in line', function(){
      assert.equal('{"a": "sam", "b": "tom", "c": "ben"}', formatter.format({a:'sam', b:'tom', c:'ben'}));
    });

    it('should format a simple object of object in line', function(){
      assert.equal('{"a": {}, "b": {}, "c": {}}', formatter.format( {a:{}, b:{}, c:{}} ));
    });

    it('should put an object containg array over many lines', function(){
      var expected = '{\n' +
      '  "a": 1,\n' +
      '  "b": "a",\n' +
      '  "c": [1, 2, 3],\n' +
      '  "d": true\n' +
      '}';
      assert.equal(formatter.format({ a:1, b:"a", c:[1, 2, 3], d:true }), expected);
    });

    it('should put an object containg empty array inline', function(){
      var expected = '{"a": 1, "b": "a", "c": [], "d": true}';
      assert.equal(formatter.format({ a:1, b:"a", c:[], d:true }), expected);
    });
  });

  describe('indentation', function() {
    it('should stack indentation object -> array -> object', function(){
      var expected = 
      '{\n' +
      '  "outer": [\n'+
      '    {"inner1": 1},\n'+
      '    {"inner2": 2}\n'+
      '  ]\n' +
      '}';
      var actual = formatter.format( {outer:[{inner1:1}, {inner2:2}]} );

      assert.equal(expected, actual);
    });

    it('should stack indentation array -> object -> array', function(){
      var expected = 
      '[\n' +
      '  {\n'+
      '    "a": [1, 2, 3],\n'+
      '    "b": [1, 2, 3]\n'+
      '  }\n'+
      ']';
      var actual = formatter.format( [{a:[1,2,3], b:[1,2,3]}] );

      assert.equal(expected, actual);
    });

    it('should do empty arrays in objects inline', function(){
      var expected = 
      '{"a": [], "b": []}';
      var actual = formatter.format( {a:[], b:[]});

      assert.equal(expected, actual);
    });

    it('should do empty objects in arrays inline', function(){
      var expected = 
      '[{}, {}]';
      var actual = formatter.format( [{}, {}] );

      assert.equal(expected, actual);
    });
  });
});