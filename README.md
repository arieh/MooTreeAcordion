TreeAcordion
=============

this class takes a tree structure (by element id of by a passed element) and makes it tweakable with an Acordion effect.

![Screenshot](http://img709.imageshack.us/img709/2213/acordsc.png)

How to use
----------

Simple usage without any options:	

	#JS
	var list = new TreeAcordion($('root'));

Usage with all options:	

	#JS
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

An example of an HTML strcture to work with:

	#HTML
	<ul id='root'> <!-- root element /-->
		<li> <!--  branch container /-->
			<a href='javascript:;' class='handle'>
				handle</a> <!-- handle /-->
			<ul class ='branch'> <!-- a branch /-->
				<li><ul class='branch'><!-- .... /--></ul></li>
			</ul>
		</li>
	</ul>
	
Events
-----------------
  * acord-opened : fired when a branch is opened. returns the opened branch
  * acord-closed : fired when a branch is closed. returns the closed branch
  * handled-opened : fired when a handled branch is opened. returns the handler
  * handled-closed : fired when a handled branch is closed. returns the handler