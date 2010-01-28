Class: TreeAcordion {#TreeAcordion}
==========================================
The Tree-Acordion takes a tree structured HTML element and adds the effects needed to make it use an accordion effect on its branches.
the class also provides keybard accessible interface.

TreeAcordion Method: constructor {#TreeAcordion:constructor}
---------------------------------
### Syntax:

	var TH = new TreeAcorion(root,options);

### Arguments:

1. root - The root element for the tree-acordion
2. options - (`object`: optional) See below:

### Options:

 * branchClass (`string`): a class to identify branches (default to `branch`)
 * openerClass (`string`): a class to identify handles (default to `handle`)
 * branchContainer (`string`): a selector to use for identifying branch containers (default to `li`). _NOTE! this will be handled as a css selector, not a class_ 
 * acordOpenFunction (`Function`): a class to use for the opening effect
 * acordCloseFunction (`Function`): same but for closing
 * multiple (`bool`): whether or not to allow multiple branches to be opened at the same time (default to `false`)
 * debug (`bool`): logs to console the last opened branch (default to `false`)
 * rtl (`bool`): whether the list is a right-to-left list. this will be used for keyboard binding (default to `false`)

### Example:
	
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
 

TreeAcordion: Events {#TreeAcordion:events)
-----------------
 * acord-opened : fired when a branch is opened. returns the opened branch
 * acord-closed : fired when a branch is closed. returns the closed branch
 * handled-opened : fired when a handled branch is opened. returns the handler
 * handled-closed : fired when a handled branch is closed. returns the handler