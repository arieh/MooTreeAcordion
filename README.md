TreeAcordion
=============

this class takes a tree structure (by element id of by a passed element) and makes it tweakable with an Acordion effect.

![Screenshot](http://github.com/arieh/MooTreeAcordion/raw/master/acord-sc.png)

How to use
----------
	
	An example HTML structure:
	<ul id='root'>
		<li>
			<span class='handle'>open Me 1</span>
			<ul class='branch'>
				<li>Opened</li>
			</ul>
		</li>
		<li>
			<span clas='handle'>open Me 2</span>
			<ul class='branch'>
				<li>Opened</li>
			</ul>
		</li>
	</ul>
	
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