TreeAcordion
=============

this class takes a tree structure (by element id of by a passed element) and makes it tweakable with an Acordion effect.

How to use
----------
	#HTML
	&lt;ul id='root'&rt;
		&lt;li&rt;
			&lt;span class='handle'&rt;open Me 1&lt;/span&rt;
			&lt;ul class='branch'&rt;
				&lt;li&rt;Opened&lt;/li&rt;
			&lt;/ul&rt;
		&lt;/li&rt;
		&lt;li&rt;
			&lt;span clas='handle'&rt;open Me 2&lt;/span&rt;
			&lt;ul class='branch'&rt;
				&lt;li&rt;Opened&lt;/li&rt;
			&lt;/ul&rt;
		&lt;/li&rt;
	&lt;/ul&rt;
	
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