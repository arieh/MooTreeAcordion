/*!
Copyright (c) 2009 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/

var TreeAcordion = new Class({
	Implements: [Options, Events],
	options: {
		branchClass : 'branch',  //the branches class
		openerClass : 'acord-handle', //the handlers class
		branchContrainer : 'li', //the direct container element of all branches
		acordOpenFunction : $empty, //a function to use for opening a branch
		acordCloseFunction : $empty, //a function to use for closing a branch
		multiple : false, //whether or not to allow multiple branches to be opened alongside
		debug : false //debug mode
	},
	root : $empty,
	current : $empty,
	/**
	 * constructor
	 * @param {Element} root the root element of the list
	 * @param {Object} options
	 */
	initialize : function(root,options){
		this.setOptions(options);
		if (this.options.acordOpenFunction == $empty) this.options.acordOpenFunction = this.acordOpenFunction;
		if (this.options.acordCloseFunction == $empty) this.options.acordCloseFunction = this.acordCloseFunction;
		this.root = document.id(root);
		
		var self=this,
			clone = this.root.clone(),
			branches = this.root.getElements('.'+this.options.branchClass),  
			root_containers = this.root.getElements(this.options.branchContrainer);
		
		clone.replaces(this.root);		
		
		this.root.setStyle('left',-9999);
		$$('body')[0].adopt(this.root);
		
		branches.each(function(branch){
			branch.setStyle('display','block');
			self.initBranch(branch);
			self.initBranchHeight(branch);
		});
		
		root_containers.each(this.initBranchContainer.bind(this));
		
		this.root.setStyle('height','auto');
		this.root.store('full-height',this.root.getSize().y.toInt());
		this.root.setStyle('height',this.root.retrieve('full-height'));
		this.root.replaces(clone);
		clone.destroy();
		if (this.options.debug) console.log('tree is initialized');
	},
	/**
	 * initializes a branch's default properties
	 * @param {Element} branch
	 */
	initBranch : function(branch){		
		var height;
		branch.setStyles({
			'position':'relative',
			'height':0,
			'left':0,
			overflow:'hidden'
		});
		branch.addClass('acord-closed');
		branch.store('parent-branch',this.findParent(branch));
	},
	/**
	 * stores the branch`s full height
	 * @param {Element} branch
	 */
	initBranchHeight : function(branch){
		branch.setStyle('height','auto');
		branch.store('full-height',branch.getSize().y.toInt());
		branch.setStyle('height',0);
	},
	/**
	 * initializes the branches containers
	 * @param {Element} container
	 */
	initBranchContainer :function(container){
		var branch  = container.getElement('.'+this.options.branchClass), 
			parent = branch ? branch.retrieve('parent-branch'):this.findParent(container) ,
			handler = container.getElement('.'+this.options.openerClass),
			self = this,
			height;
			
		if (!handler) handler = container;
		if (!branch){
			container.addEvent('click',function(e){e.stopPropagation();});
			return;
		}
		branch.store('handler',handler);
				
		handler.addEvent('click',function(e){
			self.toggleHandler(branch);
			if (e) e.stopPropagation();
		});
	},
	/**
	 * finds the parent branch of a given element
	 * @param {Element} ele
	 */
	findParent : function(ele){
		var parent = ele.getParent();
		
		while (parent.get('tag')!='body' && parent != this.root){
			if (parent.hasClass('branch')) return parent;
			parent = parent.getParent();
		}
		
		if (parent == this.root) return parent;
		
		throw "no root element found for tree";
	},
	toggleHandler : function(branch){
		if (this.options.debug) console.log(branch.get('id'));
			
		var parent = branch.retrieve('parent-branch'),
			last_branch= parent.retrieve('last-branch');
				
		if (!last_branch){
			this.Acord(branch);
			return;
		}
				
		if (last_branch != branch ){
			if (last_branch.hasClass('acord-opened') && false == this.options.multiple){
				this.Acord(last_branch);
			} 
		}
				
		this.Acord(branch);
	},
	/**
	 * calls the Accordion effect on a given branch
	 * @param {Element} branch
	 */
	Acord : function(branch){
		if (branch.hasClass('acord-closed')){
			this.openBranch(branch);
		}else{
			this.closeBranch(branch);
		}
	},
	/**
	 * performs the opening action on a branch
	 * @param {Element} branch
	 */
	openBranch : function(branch){
		var height = branch.retrieve('full-height'),
			parent = branch.retrieve('parent-branch');
			
		this.options.acordOpenFunction(branch,height);
			
		branch.removeClass('acord-closed');
		branch.addClass('acord-opened');
			
		if (parent)	this.AcordParentOpen(parent,height);
			
		this.fireEvent('acord-opened',branch);
		this.fireEvent('handled-opened',branch.retrieve('handler'));
			
		if (this.current && this.current.removeClass) this.current.removeClass('accord-current');
		
		this.current = branch;
		this.current.addClass('accord-current');
			
		parent.store('last-branch',branch);	
	},
	/**
	 * performs the closing action on a branch
	 * @param {Element} branch
	 */
	closeBranch : function(branch){
		var height = branch.retrieve('full-height'),
			parent = branch.retrieve('parent-branch');
		
		if (this.options.multiple) this.closeMultipleChildren(branch);
		else this.closeChildBranches(branch);

		if (parent)	this.AcordParentClose(parent,height);
			
		this.options.acordCloseFunction(branch,height);	
			
		branch.removeClass('acord-opened');
		branch.addClass('acord-closed');
		parent.store('last-branch',false);
			
		this.fireEvent('acord-closed');
		this.fireEvent('handled-closed',branch.retrieve('handler'));
		
		if (this.current && this.current.removeClass) this.current.removeClass('accord-current');
			
		this.current = $empty;
	},
	/**
	 * closes the child-branches of a branch in a multiple:false scenario
	 * @param {Element} branch
	 */
	closeChildBranches : function(branch){
		var children = [], child = branch.retrieve('last-branch');
		while (child){
			children.push(child);
			child = child.retrieve('last-branch');
		} 
		child = children.pop();
		while (child){
			this.Acord(child);
			child = children.pop();
		}
	},
	/**
	 * closes the child-branches of a branch in a multiple:true scenario
	 * @param {Element} branch
	 */
	closeMultipleChildren : function (branch){
		var child = branch.getElement('.acord-opened');
		while (child){
			this.closeMultipleChildren(child);
			this.Acord(child);
			child = branch.getElement('.acord-opened');
		}
	},
	/**
	 * bubbles up the opening effect of a branch
	 * @param {Element} branch
	 * @param {int} height the added height
	 */
	AcordParentOpen : function(branch,height){
		var branch_height = branch.retrieve('current-height'),
			parent = branch.retrieve('parent-branch');
		
		if (!branch_height) branch_height = branch.retrieve('full-height');
		
		branch.store('current-height',branch_height+height);
		this.acordOpenFunction(branch,branch_height+height);
		
		if (parent) this.AcordParentOpen(parent,height);
	},
	/**
	 * bubbles up the closing effect of a branch
	 * @param {Element} branch
	 * @param {int} height the reduced height
	 */
	AcordParentClose :function(branch,height){
		var branch_height = branch.retrieve('current-height'),
			parent = branch.retrieve('parent-branch');
		
		if (!branch_height) branch_height = branch.retrieve('full-height');
		
		branch.store('current-height',branch_height-height);
		branch.tween('height',branch_height-height);
		
		if (branch == this.root) return;
		
		this.AcordParentClose(parent,height);
	},
	/**
	 * the default accordion-open effect
	 * @param {Element} branch
	 * @param {int} height
	 */
	acordOpenFunction : function(branch,height){
		branch.tween('height',height);
	},
	/**
	 * the default accordion-open effect
	 * @param {Element} branch
	 * @param {int} height not used by this effect
	 */
	acordCloseFunction : function(branch,height){
		branch.tween('height',0);
	},
	/**
	 * sets the multiple flag
	 * @param {bool} flag
	 */
	setMultiple : function(flag){
		if (flag !== 'undefined'){
			this.options.multiple = (flag===true);
		}else{
			this.options.multiple = this.options.multiple ? false : true;
		}
		if (this.options.multiple == false){
			this.closeMultipleChildren(this.root,this);
		}		
		if (this.options.debug) console.log('multiple:',this.options.multiple);
		return this;
	},
	/**
	 * sets the debug flag
	 * @param {bool} flag
	 */
	setDebug : function(flag){
		if (flag !== 'undefined'){
			this.options.debug = (flag===true);
		}else{
			this.options.debug = this.options.debug ? false : true;
		}		
		if (this.options.debug) console.log('debug:',this.options.debug);
		return this;
	}
});