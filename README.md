TreeAcordion
=============

this class takes a tree structure (by element id of by a passed element) and makes it tweakable with an Acordion effect.

![Screenshot](http://github.com/arieh/MooTreeAcordion/raw/master/acord-sc.png)

How to use
----------
	
	#CSS
	ul#root   <--|root element|
		li      <--|container|
			a.handle   <--|handle|
			ul.branch   <--|a branch|
				li ....   <--|inner content|

	
	#JS
	//Simple Example
	var list = new TreeAcordion($('root'));
	
	//All Options
	var list = new TreeAcordion('root',{
		branchClass :'branch',
		openerClass: 'handle',
		branchContainer : 'li',
		acordOpenFunction : function(el,height){/* ... */},
		acordCloseFunction : function(el,height){/* ... */},
		multiple: true,
		debug : false,
		rtl : true
	});

Events
-----------------
  * acord-opened : fired when a branch is opened. returns the opened branch
  * acord-closed : fired when a branch is closed. returns the closed branch
  * handled-opened : fired when a handled branch is opened. returns the handler
  * handled-closed : fired when a handled branch is closed. returns the handler