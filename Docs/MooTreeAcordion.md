Usage Explination
===================
The Tree-Acordion takes a tree structured HTML element and adds the effects needed to make it use an accordion effect on its branches.
the class also provides keybard accessible interface.

HTML Structure:
----------------
the library recognized 4 key components of a tree-
  # Root - the root element containing the entire tree
  # Branch - a sub-tree that is toggelable with the accordion effect
  # Handle - each branch must have a handle. the first handle on a branche's container will be used as its handle
  # Branch Container - each branch is contained in a separate containing element. each container should only have one handle-branch pair

the most basic example for this structure is this:
<pre>
<ul id='root'><!-- a root element --/>
	<li> <!--  a container --/>
		<span class='handle'>open Me 1</span> <!-- a handle --/>
		<ul class='branch'> <!-- a branch -->
			<li>Opened</li>
		</ul>
	</li>
</ul>
</pre>

but you can use any other structure you would like under these rules.
each of these are costumizable through the Class's options.

Option List
------------
  * branchClass : a class to identify branches
  * openerClass : a class to identify handles
  * branchContainer : a selector to use for identifying branch containers. _NOTE! this will be handled as a css selector, not a class_
  * acordOpenFunction : a class to use for the opening effect
  * acordCloseFunction : same but for closing
  * multiple : whether or not to allow multiple branches to be opened at the same time (default:false)
  * debug : logs to console the last opened branch
  * rtl : whether the list is a right-to-left list. this will be used for keyboard binding
