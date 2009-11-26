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
		branchClass : 'branch', 
		openerClass : 'acord-handle',
		branchContrainer : 'li',
		acordOpenFunction : $empty,
		acordCloseFunction : $empty,
		multiple : false
	},
	root : $empty,
	current : $empty,
	initialize : function(root,options){
		this.setOptions(options);
		if (this.options.acordOpenFunction == $empty) this.options.acordOpenFunction = this.acordOpenFunction;
		if (this.options.acordCloseFunction == $empty) this.options.acordCloseFunction = this.acordCloseFunction;
		this.root = $(root);
		
		var self=this,
			clone = this.root.clone(),
			branches = this.root.getElements('.'+this.options.branchClass),  
			root_lis = this.root.getElements(this.options.branchContrainer);
		
		clone.replaces(this.root);		
		
		this.root.setStyle('left',-9999);
		$$('body')[0].adopt(this.root);
		this.root.store('full-height',this.root.getSize().y.toInt());
		
		branches.each(function(branch){
			branch.setStyle('display','block');
			self.initBranches(branch);
			self.initBranchHeights(branch);
		});

		this.root.replaces(clone);
		clone.destroy();
		
		root_lis.each(function(li){
			var branch  = li.getElement('.'+self.options.branchClass),
				parent = li.getParent(),height,
				handler = li.getElement('.'+self.options.openerClass);
			if (!handler) handler = li;
			
			if (!branch){
				li.addEvent('click',function(e){e.stopPropagation();});
				return;
			}
			branch.store('handler',handler);	
			handler.addEvent('click',function(e){
				var last_branch= parent.retrieve('last-branch');
				
				if (!last_branch){
					parent.store('last-branch',branch);
					self.Acord(branch);
					e.stopPropagation();
					return;
				}
				if (last_branch === branch){
					self.Acord(branch);
				}else{
					if (last_branch.hasClass('acord-opened') && false == self.options.multiple) self.Acord(last_branch);
					self.Acord(branch);
					parent.store('last-branch',branch);
				}
				e.stopPropagation();
			});
		});
	},
	initBranches : function(branch){		
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
	initBranchHeights : function(branch){
		branch.setStyle('height','auto');
		branch.store('full-height',branch.getSize().y.toInt());
		branch.setStyle('height',0);
	},
	Acord : function(branch){
		var height = branch.retrieve('full-height'),
			parent = branch.retrieve('parent-branch'),
			self = this;
		if (branch.hasClass('acord-closed')){
			this.options.acordOpenFunction(branch,height);
			
			branch.removeClass('acord-closed');
			branch.addClass('acord-opened');
			
			if (parent)	this.AcordParentOpen(parent,height);
			
			this.fireEvent('acord-opened',branch);
			this.fireEvent('handled-opened',branch.retrieve('handler'));
			
			if (this.current && this.current.removeClass) this.current.removeClass('accord-current');
			
			this.current = branch;
			this.current.addClass('accord-current');	
		}else{
			branch.getElements('.acord-opened').each(function(child){
				self.Acord(child);
			})
			if (parent)	this.AcordParentClose(parent,height);
			this.options.acordCloseFunction(branch,height);	
			branch.getElements('.'+this.options.branchClass)
				.each(function(br){
					br.setStyle('height',0)
					.addClass('acord-closed')
					.removeClass('acord-opened')
					.store('last-branch',false);
				});
			branch.removeClass('acord-opened');
			branch.addClass('acord-closed');
			this.fireEvent('acord-closed');
			this.fireEvent('handled-closed',branch.retrieve('handler'));
			if (this.current != $empty) this.current.removeClass('accord-current');
			this.current = $empty;
		}
		
	},
	AcordParentOpen : function(branch,height){
		var branch_height = branch.retrieve('current-height'),
			parent = branch.retrieve('parent-branch');
		if (!branch_height) branch_height = branch.retrieve('full-height');
		
		branch.store('current-height',branch_height+height);
		branch.tween('height',branch_height+height);
		
		//if (parent) console.log('open-'+branch.get('id'),[branch_height,height,branch_height+height])
		if (parent) this.AcordParentOpen(parent,height);
	},
	AcordParentClose :function(branch,height){
		var branch_height = branch.retrieve('current-height'),
			parent = branch.retrieve('parent-branch');
		if (!branch_height) branch_height = branch.retrieve('full-height');
		
		branch.store('current-height',branch_height-height);
		branch.tween('height',branch_height-height);
		
		//if (parent) console.log('close-'+branch.get('id'),[branch_height,height,branch_height-height]);
		if (branch == this.root) return;
		
		this.AcordParentClose(parent,height);
	},
	findParent : function(branch){
		var parent = branch.getParent();
		while (parent.get('tag')!='body' && parent != this.root){
			if (parent.hasClass('branch')) return parent;
			parent = parent.getParent();
		}
		if (parent == this.root) return parent;
		throw "no root element found for tree";
	},
	acordOpenFunction : function(branch,height){
		branch.tween('height',height);
	},
	acordCloseFunction : function(el){
		el.tween('height',0);
	}
});