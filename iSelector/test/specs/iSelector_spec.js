describe("common", function () {
	beforeEach(function(){
        jasmine.getFixtures().fixturesPath = 'specs/fixtures';
        jasmine.getFixtures().load('dom.html');
    });

    it('matches', function() {
    	var node = document.getElementById('outter');
    	var child = document.getElementById('inner');
    	expect(matches(node, '#outter')).toBe(true);
    	expect(matches(node, 'div')).toBe(true);
    	expect(matches(node, '[name=outter1]')).toBe(true);
    	expect(matches(child, ':first-child')).toBe(true);
    	expect(matches(child, '#outter > p:first-child')).toBe(true);
    });
    
    it('qsa', function() {
    	var node = document.getElementById('outter');
      	var child = document.getElementById('inner3');
    	expect(node).toEqual(qsa(document, '#outter'));
    	expect([]).toEqual(qsa(document, '#outter2'));
    	expect([]).toEqual(qsa({nodeType:2}, '#outter'));
    	expect(node).toEqual(qsa(document, '.db'));
    	expect(child).toEqual(qsa(document, 'h1'));
    	expect(node).toEqual(qsa(document, '[name=outter1]'));
    });
    
    it('extend', function() {
    	var source = {0:'a', 1:{a:'b'}};
    	var target = {};
    	extend(target, source);
    	expect(target).toEqual(source);
    	
    	var source = {0:'a', '__proto__':{add:'123'}};
    	var target = {};
    	extend(target, source);
    	expect(target).toEqual(source);
    });
    
    it('contains', function() {
    	var node = document.getElementById('outter');
    	var child = document.getElementById('inner3');
    	var outter = document.getElementById('outter4');
    	expect(contains(node, child)).toBe(true);
    	expect(contains(node, outter)).toBe(false);
    });
});