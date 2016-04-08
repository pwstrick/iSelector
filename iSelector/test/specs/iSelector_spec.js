describe("common", function () {
	beforeEach(function(){
        jasmine.getFixtures().fixturesPath = 'specs/fixtures';
        jasmine.getFixtures().load('dom.html');
    });

    it('matches', function() {
    	var node = document.getElementById('outter');
    	var child = document.getElementById('inner');
    	expect(S.matches(node, '#outter')).toBe(true);
    	expect(S.matches(node, 'div')).toBe(true);
    	expect(S.matches(node, '[name=outter1]')).toBe(true);
    	expect(S.matches(child, ':first-child')).toBe(true);
    	expect(S.matches(child, '#outter > p:first-child')).toBe(true);
    });
    
    it('qsa', function() {
    	var node = document.getElementById('outter');
      	var child = document.getElementById('inner3');
    	expect(node).toEqual(S.qsa(document, '#outter'));
    	expect([]).toEqual(S.qsa(document, '#outter2'));
    	expect([]).toEqual(S.qsa({nodeType:2}, '#outter'));
    	expect(node).toEqual(S.qsa(document, '.db'));
    	expect(child).toEqual(S.qsa(document, 'h1'));
    	expect(node).toEqual(S.qsa(document, '[name=outter1]'));
    });
    
    it('iSelector', function() {
    	var node = document.getElementById('outter');
      	var child = document.getElementById('inner3');
    	//expect(node).toEqual(S('#outter'));
    	expect(S('#outter2').length).toBe(0);
    	expect(S('.db').length).toBe(1);
//  	expect(child).toEqual(S('h1'));
//  	expect(node).toEqual(S('[name=outter1]'));
    });
    
    it('extend', function() {
    	var source = {0:'a', 1:{a:'b'}};
    	var target = {};
    	S.extend(target, source);
    	expect(target).toEqual(source);
    	
    	var source = {0:'a', '__proto__':{add:'123'}};
    	var target = {};
    	S.extend(target, source);
    	expect(target).toEqual(source);
    });
    
    it('contains', function() {
    	var node = document.getElementById('outter');
    	var child = document.getElementById('inner3');
    	var outter = document.getElementById('outter4');
    	expect(S.contains(node, child)).toBe(true);
    	expect(S.contains(node, outter)).toBe(false);
    });
    
    it('filter', function() {
    	var child = document.getElementById('inner');
    	expect(S('p').filter(':first-child')[0]).toEqual(child);
    	expect(S('p').filter('.dn').length).toBe(2);
    	
    	var results = S('p').filter(function(index) {
    		return this.className == 'dn';
    	});
    	expect(results.length).toBe(2);
    });
    
    it('find', function() {
    	var child = document.getElementById('inner');
    	
    	expect(S('[name=outter_find]').find('.db2').length).toBe(4);
    	expect(S('#outter5').find('.db2').length).toBe(3);
    });
    
    it('closest', function() {
    	var child = document.getElementById('inner3');
    	var parent = document.getElementById('outter');
    	expect(S('#inner3').closest('#outter')[0]).toEqual(parent);
    	expect(S('#inner3').closest('#outter1')[0]).toEqual(child);
    });
    
    it('children', function() {
    	expect(S('#outter').children().length).toBe(3);
    	expect(S('#outter').children('h1').length).toBe(1);
    });
    
    it('siblings', function() {
    	expect(S('#inner,#inner5').siblings().length).toBe(4);
    	expect(S('#inner,#inner5').siblings('.db2').length).toBe(1);
    });
    
    it('prev', function() {
    	expect(S('#outter6').prev()).toEqual(document.getElementById('outter5'));
    	expect(S('#outter').prev().length).toBe(0);
    	expect(S('#outter6').prev('[name=outter_find]').length).toBe(1);
    	expect(S('#outter6').prev('[name=outter_findxx]').length).toBe(0);
    });
    
    it('before,after', function() {
    	var node = document.createElement('div');
    	node.innerHTML = 123;
    	S('#inner7').before(node);
    	expect(S('#inner7').prev()).toEqual(node);
    	
    	var node2 = document.createElement('div');
    	node2.innerHTML = 456;
    	S('#inner7').after(node2);
    	expect(S('#inner7').next()).toEqual(node2);
    });
    
    it('html', function() {
    	expect(S('#inner8').html()).toEqual(document.getElementById('inner8').innerHTML);
    	S('#inner8').html('测试');
    	expect(S('#inner8').html()).toEqual('测试');
    	expect(S('#innerxx8').html()).toBeNull();
    	S('[name=inner9]').html('仅仅inner9');
		expect(S('[name=inner9]:last-child').html()).toEqual('仅仅inner9');
    });
    
    it('attr', function() {
    	S('#outter9').attr('name', '测试');
    	expect(S('#outter9').attr('name')).toEqual('测试');
    	S('#outter9').attr({'class':'dbxx'}, 123);
    	expect(S('#outter9').attr('class')).toEqual('dbxx');
    	
    	S('#outter9').removeAttr('class');
    	expect(S('#outter9').attr('class')).toBeNull();
    	
    	S('#outter9').attr({'class':'dbxx'});
    	S('#outter9').removeAttr('class name');
    	expect(S('#outter9').attr('class')).toBeNull();
    });
    
    it('setClass', function() {
    	S('#outter10').setClass('db001');
    	expect(document.getElementById('outter10').className).toEqual('db001');
    	
    	S('#outter10').setClass('db004 db005');
    	expect(document.getElementById('outter10').className).toEqual('db004 db005 db001');
    	
    	S('#outter10').setClass(['db006','db007']);
    	expect(document.getElementById('outter10').className).toEqual('db006 db007 db004 db005 db001');
    	
    	S('#inner10').setClass('db003');
    	expect(document.getElementById('inner10').className).toEqual('db003 db002');
    	
    	S('#outter10').setClass('db001', false);
    	expect(document.getElementById('outter10').className).toEqual('db006 db007 db004 db005');
    	
    	S('#outter10').setClass('db006 db007', false);
    	expect(document.getElementById('outter10').className).toEqual('db004 db005');
    	
    	S('#outter10').setClass('db004 db005', false);
    	expect(document.getElementById('outter10').className).toBe('');
    	
    	expect(S('#inner10').setClass()).toEqual('db003 db002');
    });
});